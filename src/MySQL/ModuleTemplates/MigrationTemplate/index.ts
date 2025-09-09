import ModuleTemplate from "../ModuleTemplate"

// Database Schema
import { ColumnSchema, ForeignKeyReferencesSchema } from "../../DatabaseSchema"

// Utils
import { resolve } from "path"
import util from "util";

// Types
import type {
    EntityMetadata,
    DataType,

    CHAR,
    VARCHAR,
    TEXT,
    INT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    BOOLEAN,
    ENUM,
    SET,
    TIMESTAMP,
    DATETIME,
    DATE,
    TIME,
    YEAR,
    JSON,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,
} from "../../Metadata"
import type { ActionType, TableSchema } from "../../DatabaseSchema"

export default class MigrationTemplate extends ModuleTemplate {
    private readonly packageImportPath = '../../../MySQL'

    private origin: 'default' | 'sync' = 'default'
    private schema!: TableSchema
    private previousSchema?: TableSchema
    private metadata!: EntityMetadata

    private hasTimestamps: boolean = false

    private shouldImportDataType: boolean = false

    constructor(
        private dir: string,
        private className: string,
        private fileName: string,
        private action: ActionType,
        private tableName: string,
    ) {
        super()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get name(): string {
        return this.fileName
    }

    // ------------------------------------------------------------------------

    protected get path(): string {
        return resolve(`src/TestTools/Migrations/${this.dir}`)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public sync(
        metadata: EntityMetadata,
        schema: TableSchema,
        previousSchema?: TableSchema,
    ): this {
        this.origin = 'sync'
        this.schema = schema
        this.previousSchema = previousSchema
        this.metadata = metadata

        return this
    }

    // Protecteds -------------------------------------------------------------
    protected content(): string {
        switch (this.origin) {
            case "default": return this.defaultContent()
            case "sync": return this.syncContent()
        }
    }

    // Privates ---------------------------------------------------------------
    private defaultContent(): string {
        return this.indentMany([
            `import { Migration } from "${this.packageImportPath}"`,
            '\n',
            `export default class ${this.className} extends Migration {`,
            ['public up(): void {', 4],
            [`this.database.${this.upDefaultMethod()}`, 8],
            ['}', 4],
            '\n',
            ['public down(): void {', 4],
            [this.downDefaultMethod(), 8],
            ['}', 4],
            '}'
        ])
    }

    // ------------------------------------------------------------------------

    private syncContent(): string {
        const up = this.tableSyncMethod('UP').replace('\n\n', '\n')
        const down = this.tableSyncMethod('DOWN').replace('\n\n', '\n')

        return this.indentMany([
            `import { Migration } from "${this.packageImportPath}"`,
            '\n',
            `export default class ${this.className} extends Migration {`,
            ['public up(): void {', 4],
            [`this.database.${up}`, 8],
            '\n',
            ['}', 4],
            '\n',
            ['public down(): void {', 4],
            [`this.database.${down}`, 8],
            ['}', 4],
            '}'
        ])
            .replace('\n\n\n', '\n')
    }

    // ------------------------------------------------------------------------

    private upDefaultMethod(): string {
        switch (this.action) {
            case "CREATE": return (
                `createTable('${this.tableName}', table => {\n\n})`
            )

            case "ALTER": return (
                `alterTable('${this.tableName}', table => {\n\n})`
            )

            case "DROP": return `dropTable('${this.tableName}')`

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private downDefaultMethod(): string {
        switch (this.action) {
            case "CREATE": return (
                `this.database.dropTable('${this.tableName}')`
            )

            case "ALTER":
            case "DROP": return ''

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private tableSyncMethod(method: 'UP' | 'DOWN'): string {
        const down = method === 'DOWN'

        const action: ActionType = (
            down && ['CREATE', 'DROP'].includes(this.action)
        )
            ? this.action === 'CREATE' ? 'DROP' : 'CREATE'
            : this.action

        switch (action) {
            case "CREATE": return this.indentMany([
                `createTable('${this.tableName}', table => {`,
                [this.tableSyncMethodImplementation(down), 4],
                '})'
            ])

            case "ALTER": return this.indentMany([
                `alterTable('${this.tableName}', table => {`,
                [this.tableSyncMethodImplementation(down), 4],
                '})'
            ])

            case "DROP": return `dropTable('${this.tableName}')`

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private tableSyncMethodImplementation(down: boolean = false): string {
        return this.indentMany(
            this.schema.flatMap(column => {
                const [action] = column.compare(
                    this.previousSchema?.findColumn(column.name)
                )

                if (action === 'NONE') return []

                return this.columnSyncMethod(action, column, down)
            })
                .concat(this.toDropColumns(down))
                .filter(line => line !== '')
        )
    }

    // ------------------------------------------------------------------------

    private toDropColumns(down: boolean = false): string[] {
        return this.previousSchema?.
            filter(({ name }) => !this.schema.findColumn(name))
            .map(column => this.columnSyncMethod('DROP', column, down))
            ?? []
    }

    // ------------------------------------------------------------------------

    private columnSyncMethod(
        action: ActionType,
        column: ColumnSchema,
        down: boolean = false
    ): string {
        if (down && ['CREATE', 'DROP'].includes(action)) action = (
            action === 'CREATE' ? 'DROP' : 'CREATE'
        )

        const prev = this.previousSchema?.findColumn(column.name)

        switch (action) {
            case "CREATE": return this.createColumnImplementation(column)
            case "ALTER": return `table.alterColumn('${column.name}')
                    ${this.columnImplementation(down ? prev! : column, down ? column : prev!)}
                `
            case "DROP": return `table.dropColumn('${column.name}')`


            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private createColumnImplementation(column: ColumnSchema): string {
        return (
            column.pattern
                ? this.columnPatternImplementation(column)
                : this.dataTypeColumnImplementation(column)
        )
            .replace('\n\n', '')
    }

    // ------------------------------------------------------------------------

    private columnPatternImplementation(column: ColumnSchema): string {
        const { pattern, name } = column

        switch (pattern!) {
            case "id": return `table.id(${this.idName(name)})`

            case "polymorphic-id":
                let n = this.idName(name)
                n = n ? `, ${n}` : ''
                return (
                    `table.polymorphicId('${this.metadata.target.name}'${n})`
                )

            case "foreign-id": return this.indentMany([
                `table.foreignId('${name}')`,
                [this.columnImplementation(column), 4]
            ])

            case "polymorphic-foreign-id": return this.indentMany([
                `table.polymorphicForeignId('${name}')`,
                [this.columnImplementation(column), 4]
            ])

            case "created-timestamp": return !this.hasTimestamps
                ? this.timestampsImplementation() ?? `table.createdTimestamp()`
                : ''

            case "updated-timestamp": return !this.hasTimestamps
                ? this.timestampsImplementation() ?? `table.updatedTimestamp()`
                : ''
        }
    }

    // ------------------------------------------------------------------------

    private dataTypeColumnImplementation(column: ColumnSchema): string {
        return this.indentMany([
            `table.${this.createColumnMethod(column)}`,
            [this.columnImplementation(column), 4]
        ])
    }

    // ------------------------------------------------------------------------

    private createColumnMethod(column: ColumnSchema): string {
        const { name, dataType } = column

        switch ((dataType as DataType).type) {
            case "boolean": return `boolean('${name}')`
            case "bigint": return `bigInt('${name}')`
            case "int": return `int('${name}')`
            case "tinyint": return `tinyInt('${name}')`
            case "smallint": return `int('${name}', 'SMALL')`
            case "mediumint": return `int('${name}', 'MEDUIM')`
            case "decimal": return `decimal('${name}', ${(dataType as DECIMAL).M}, ${(dataType as DECIMAL).D})`
            case "float": return `float('${name}', ${(dataType as DECIMAL).M}, ${(dataType as DECIMAL).D})`
            case "double": return `double('${name}', ${(dataType as DECIMAL).M}, ${(dataType as DECIMAL).D})`
            case "bit": return `bit('${name}', '${(dataType as BIT).length}')`
            case "char": return `char('${name}', ${(dataType as CHAR).length})`
            case "varchar": return `string('${name}', ${(dataType as VARCHAR).length})`
            case "text": return `text('${name}')`
            case "tinytext": return `text('${name}', 'TINY')`
            case "mediumtext": return `text('${name}', 'MEDIUM')`
            case "longtext": return `text('${name}', 'LONG')`
            case "blob": return `blob('${name}')`
            case "tinyblob": return `blob('${name}', 'TINY')`
            case "mediumblob": return `blob('${name}', 'MEDIUM')`
            case "longblob": return `blob('${name}', 'LONG')`
            case "enum": return `enum('${name}', [${(dataType as ENUM).options.map(o => `'${o}'`).join(', ')}])`
            case "set": return `set('${name}', [${(dataType as ENUM).options.map(o => `'${o}'`).join(', ')}])`
            case "json": return `json('${name}')`
            case "date": return `date('${name}')`
            case "datetime": return `datetime('${name}')`
            case "timestamp": return `timestamp('${name}')`
            case "time": return `time('${name}')`
            case "year": `year('${name}')`
            case "binary": return `binary('${name}', ${(dataType as BINARY).length})`
            case "varbinary": return `varbinary('${name}', ${(dataType as VARBINARY).length})`

            case "computed":
            case "json-ref": throw new Error('NOT IMPLEMENTED DATATYPE!!!')
        }
    }

    // ------------------------------------------------------------------------

    private idName(name: string): string {
        return name === 'id' ? '' : name
    }

    // ------------------------------------------------------------------------

    private columnImplementation(
        column: ColumnSchema,
        previous?: ColumnSchema
    ): string {
        const {
            primary,
            autoIncrement,
            unsigned,
            unique,
            nullable,
            defaultValue
        } = previous
                ? Object.fromEntries(Object.entries(column.map).filter(
                    ([key, value]) => value !== previous?.map[key as (
                        keyof ColumnSchema['map']
                    )]
                ))
                : column.map

        const implementation: string[] = []

        if (primary !== undefined) implementation.push(
            `.primary(${primary && !previous ? '' : util.inspect(primary)})`
        )

        if (autoIncrement !== undefined) implementation.push(
            `.autoIncrement(${autoIncrement && !previous ? '' : util.inspect(autoIncrement)})`
        )

        if (unsigned !== undefined) implementation.push(
            `.unsigned(${unsigned && !previous ? '' : util.inspect(unsigned)})`
        )

        if (unique !== undefined) implementation.push(
            `.unique(${unique && !previous ? '' : util.inspect(unique)})`
        )

        if (nullable !== undefined) implementation.push(
            `.nullable(${nullable && !previous ? '' : util.inspect(nullable)})`
        )

        if (defaultValue !== undefined) implementation.push(
            `.default(${defaultValue && !previous ? '' : util.inspect(defaultValue)})`
        )

        implementation.concat(this.constraintsImplementation(column))
        return this.indentMany(implementation)
    }

    // ------------------------------------------------------------------------

    private constraintsImplementation(
        column: ColumnSchema,
        previous?: ColumnSchema
    ): string[] {
        const { references } = column.map
        const implementation: string[] = []

        if (references && !previous?.map.references) implementation.push(
            `.constrained()`
        )

        if (references && previous?.map.references) implementation.push(
            `.alterConstraint()`
        )

        if (!references && previous?.map.references) implementation.push(
            `.dropConstraint()`
        )

        if (references) {
            const {
                tableName,
                columnName,
                onUpdate,
                onDelete
            } = previous
                    ? Object.fromEntries(Object.entries(references).filter(
                        ([key, value]) => value !== previous?.map.references?.[
                            key as keyof ForeignKeyReferencesSchema
                        ]
                    ))
                    : references.map

            if (tableName || columnName) implementation.push(
                `.references('${tableName}', '${columnName}')`
            )

            if (onUpdate) implementation.push(`.onUpdate('${onUpdate}')`)
            if (onDelete) implementation.push(`.onDelete('${onDelete}')`)
        }

        return implementation
    }

    // ------------------------------------------------------------------------

    private timestampsImplementation(): string | undefined {
        if (
            !this.hasTimestamps &&
            !!(
                this.schema.find(
                    ({ pattern }) => pattern === 'created-timestamp'
                )
                &&
                this.schema.find(
                    ({ pattern }) => pattern === 'updated-timestamp'
                )
            )
        ) {
            this.hasTimestamps = true
            return `table.timestamps()`
        }
    }
}