import ModuleTemplate from "../ModuleTemplate"

// Utils
import { resolve } from "path"
import { inspect } from "util"

// Types
import type {
    EntityMetadata,
    DataType,

    CHAR,
    VARCHAR,
    TEXT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    ENUM,
    SET,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,
} from "../../Metadata"

import type {
    TableSchema,
    ColumnSchema,
    ForeignKeyReferencesSchema,
    ActionType
} from "../../DatabaseSchema"

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

    // ------------------------------------------------------------------------

    protected get importLine(): string {
        const dataType = this.shouldImportDataType ? ', DataType' : ''

        return (
            `import { Migration${dataType} } from "${this.packageImportPath}"`
        )
    }

    // ------------------------------------------------------------------------

    protected get mainClassLine(): string {
        return `export default class ${this.className} extends Migration {`
    }

    // ------------------------------------------------------------------------

    protected get defaultCreateTableMethod(): string {
        return (
            `this.database.createTable('${this.tableName}', table => {\n\n})`
        )
    }

    // ------------------------------------------------------------------------

    protected get defaultAlterTableMethod(): string {
        return `this.database.alterTable('${this.tableName}', table => {\n\n})`
    }

    // ------------------------------------------------------------------------

    protected get defaultDropTableMethod(): string {
        return `this.database.dropTable('${this.tableName}')`
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
            this.importLine,
            '\n',
            this.mainClassLine,
            ['public up(): void {', 4],
            [this.handleDefaultMethod('UP'), 8],
            ['}', 4],
            '\n',
            ['public down(): void {', 4],
            [this.handleDefaultMethod('DOWN'), 8],
            ['}', 4],
            '}'
        ])
    }

    // ------------------------------------------------------------------------

    private syncContent(): string {
        const up = this.tableSyncMethod('UP').replace('\n\n', '\n')
        const down = this.tableSyncMethod('DOWN').replace('\n\n', '\n')

        return this.indentMany([
            this.importLine,
            '\n',
            this.mainClassLine,
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

    private handleDefaultMethod(main: 'UP' | 'DOWN' = 'UP'): string {
        switch (main === 'UP' ? this.action : this.invertAction()) {
            case "CREATE": return this.defaultCreateTableMethod
            case "ALTER": return this.defaultCreateTableMethod
            case "DROP": return this.defaultDropTableMethod

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private invertAction(action?: ActionType): ActionType {
        switch (action ?? this.action) {
            case "CREATE": return 'DROP'
            case "DROP": return 'CREATE'

            case 'DROP/CREATE':
            case "ALTER":
            case "NONE": return this.action
        }
    }

    // ------------------------------------------------------------------------

    private tableSyncMethod(method: 'UP' | 'DOWN'): string {
        const down = method === 'DOWN'

        switch (down ? this.invertAction() : this.action) {
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
        const prev = this.previousSchema?.findColumn(column.name)

        switch (down ? this.invertAction(action) : action) {
            case "CREATE": return this.createColumnImplementation(column)

            case "ALTER": return this.indentMany([
                `table.alterColumn('${column.name}')`,
                [
                    this.columnImplementation(
                        down ? prev! : column,
                        down ? column : prev!
                    ),
                    4
                ]
            ])

            case 'DROP/CREATE': this.indentMany([
                `table.dropColumn('${column.name}')`,
                this.createColumnImplementation(down ? prev! : column),
            ])

            case "DROP": return `table.dropColumn('${column.name}')`


            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private createColumnImplementation(column: ColumnSchema): string {
        return (
            column.pattern
                ? this.patternColumnImplementation(column)
                : this.commonColumnImplementation(column)
        )
            .replace('\n\n', '')
    }

    // ------------------------------------------------------------------------

    private patternColumnImplementation(column: ColumnSchema): string {
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

    private commonColumnImplementation(column: ColumnSchema): string {
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

            case "computed": return `computed('${name}', ${this.dataType((dataType as COMPUTED).dataType)}, '${(dataType as COMPUTED).config.as}', '${(dataType as COMPUTED).config.type}')`
            case "json-ref": return `jsonRef('${name}', ${this.dataType((dataType as JSONReference).dataType)}, ${inspect((dataType as JSONReference).config)})`
        }
    }

    // ------------------------------------------------------------------------

    private dataType(dataType: DataType): string {
        this.shouldImportDataType = true

        switch (dataType.type) {
            case "boolean": return `DataType.BOOLEAN()`
            case "bigint": return `DataType.INT('BIG')`
            case "int": `DataType.INT()`
            case "tinyint": `DataType.INT('TINY')`
            case "smallint": `DataType.INT('SMALL')`
            case "mediumint": `DataType.INT('MEDIUM')`
            case "decimal": `DataType.DECIMAL(${(dataType as DECIMAL).M}, ${(dataType as DECIMAL).D})`
            case "float": `DataType.FLOAT(${(dataType as FLOAT).M}, ${(dataType as FLOAT).D})`
            case "double": `DataType.DOUBLE(${(dataType as DOUBLE).M}, ${(dataType as DOUBLE).D})`
            case "bit": `DataType.BIT(${(dataType as BIT).length})`
            case "char": `DataType.CHAR(${(dataType as CHAR).length})`
            case "varchar": `DataType.VARCHAR(${(dataType as VARCHAR).length})`
            case "text": `DataType.TEXT()`
            case "tinytext": `DataType.TEXT('${(dataType as TEXT).length}')`
            case "mediumtext": `DataType.TEXT('${(dataType as TEXT).length}')`
            case "longtext": `DataType.TEXT('${(dataType as TEXT).length}')`
            case "blob": `DataType.BLOB()`
            case "tinyblob": `DataType.BLOB('${(dataType as BLOB).length}')`
            case "mediumblob": `DataType.BLOB('${(dataType as BLOB).length}')`
            case "longblob": `DataType.BLOB('${(dataType as BLOB).length}')`
            case "enum": `DataType.ENUM(${(dataType as ENUM).options.map(o => `'${o}'`).join(', ')})`
            case "set": `DataType.SET(${(dataType as SET).options.map(o => `'${o}'`).join(', ')})`
            case "json": `DataType.JSON()`
            case "date": `DataType.DATE()`
            case "datetime": `DataType.DATETIME()`
            case "timestamp": `DataType.TIMESTAMP()`
            case "time": `DataType.TIME()`
            case "year": `DataType.YEAR()`
            case "binary": `DataType.BINARY(${(dataType as BINARY).length})`
            case "varbinary": `DataType.VARBINARY(${(dataType as VARBINARY).length})`

            default: throw new Error
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
            `.primary(${primary && !previous ? '' : inspect(primary)})`
        )

        if (autoIncrement !== undefined) implementation.push(
            `.autoIncrement(${autoIncrement && !previous ? '' : inspect(autoIncrement)})`
        )

        if (unsigned !== undefined) implementation.push(
            `.unsigned(${unsigned && !previous ? '' : inspect(unsigned)})`
        )

        if (unique !== undefined) implementation.push(
            `.unique(${unique && !previous ? '' : inspect(unique)})`
        )

        if (nullable !== undefined) implementation.push(
            `.nullable(${nullable && !previous ? '' : inspect(nullable)})`
        )

        if (defaultValue !== undefined) implementation.push(
            `.default(${defaultValue && !previous ? '' : inspect(defaultValue)})`
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