// Utils
import { inspect } from "util"

// Helpers
import { ModuleStringHelper } from "../../../Helpers"

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
    ENUM,
    SET,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,
} from "../../../../Metadata"

import type {
    ColumnSchema,
    ForeignKeyReferencesSchema,
    ActionType,
    ColumnSchemaMap,
    ForeignKeyReferencesSchemaMap
} from "../../../../DatabaseSchema"

export default class ColumnMigrationImplements {
    constructor(
        private metadata: EntityMetadata,
        private action: ActionType,
        private schema: ColumnSchema,
        private previous?: ColumnSchema,
        private hasTimestamps: boolean = false
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public implements(): string {
        switch (this.action) {
            case "CREATE": return this.createImplements()

            case "ALTER": return ModuleStringHelper.indentMany([
                `table.alterColumn('${this.schema.name}')`,
                [this.propsImplements(), 4]
            ])

            case "DROP": return `table.dropColumn('${this.schema.name}')`

            default: throw new Error
        }
    }

    // Privates ---------------------------------------------------------------
    private createImplements(): string {
        return (
            this.schema.pattern
                ? this.patternImplements()
                : this.commonImplements()
        )
    }

    // ------------------------------------------------------------------------

    private commonImplements(): string {
        return ModuleStringHelper.indentMany([
            `table.${this.createMethod()}`,
            [this.propsImplements(), 4]
        ])
    }

    // ------------------------------------------------------------------------

    private patternImplements(): string {
        const { pattern, name } = this.schema

        switch (pattern!) {
            case "id": return `table.id(${this.idName()})`

            // ----------------------------------------------------------------

            case "polymorphic-id": return `table.polymorphicId(${(
                `'${this.metadata.target.name}'` + this.idName(true)
            )})`

            // ----------------------------------------------------------------

            case "foreign-id": return ModuleStringHelper.indentMany([
                `table.foreignId('${name}')`,
                [this.propsImplements(), 4]
            ])

            // ----------------------------------------------------------------

            case "polymorphic-foreign-id": return ModuleStringHelper
                .indentMany([
                    `table.polymorphicForeignId('${name}')`,
                    [this.propsImplements(), 4]
                ])

            // ----------------------------------------------------------------

            case "polymorphic-type-key": return (
                `table.polymorphicTypeKey('${name}', ${(
                    (this.schema.dataType as ENUM)
                        .options
                        .map(o => `'${o}'`).join(', ')
                )})`
            )

            // ----------------------------------------------------------------

            case "created-timestamp": return this.hasTimestamps
                ? ''
                : 'table.createdTimestamp()'

            // ----------------------------------------------------------------

            case "updated-timestamp": return this.hasTimestamps
                ? ''
                : 'table.updatedTimestamp()'

            // ----------------------------------------------------------------


            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private createMethod(): string {
        return this.createMethodName() + this.createMethodArgs()
    }

    // ------------------------------------------------------------------------

    private createMethodName(): string {
        const { dataType } = this.schema

        switch ((dataType as DataType).type) {
            case "varchar": return `string`

            case "text":
            case "tinytext":
            case "mediumtext":
            case "longtext": return `text`

            case "int":
            case "smallint":
            case "mediumint": return `int`

            case "blob":
            case "tinyblob":
            case "mediumblob":
            case "longblob": return `blob`

            case "char":
            case "tinyint":
            case "bigint":
            case "decimal":
            case "float":
            case "double":
            case "boolean":
            case "enum":
            case "set":
            case "json":
            case "date":
            case "datetime":
            case "timestamp":
            case "time":
            case "year":
            case "binary":
            case "varbinary":
            case "computed":
            case "bit": return (dataType as DataType).type

            case "json-ref": return `jsonRef`
        }
    }

    // ------------------------------------------------------------------------

    private createMethodArgs(): string {
        const { name, dataType } = this.schema

        switch ((dataType as DataType).type) {
            case "int":
            case "bigint":
            case "tinyint":
            case "text":
            case "boolean":
            case "blob":
            case "json":
            case "date":
            case "datetime":
            case "timestamp":
            case "time":
            case "year": return `('${name}')`

            // ----------------------------------------------------------------

            case "tinytext":
            case "tinyblob":
            case "smallint":
            case "mediumint":
            case "mediumtext":
            case "mediumblob":
            case "longtext":
            case "longblob":
            case "decimal":
            case "float":
            case "double":
            case "char":
            case "varchar":
            case "bit":
            case "binary":
            case "varbinary": return `(${[
                `'${name}'`,
                this.dataTypeArgs(dataType as DataType)
            ].join(', ')})`

            // ----------------------------------------------------------------

            case "enum":
            case "set": return `(${[
                `'${name}'`,
                `[${this.dataTypeArgs(dataType as DataType)}]`
            ].join(', ')})`

            // ----------------------------------------------------------------

            case "computed": return `(${[
                `'${name}'`,
                this.dataType((dataType as COMPUTED).dataType),
                `'${(dataType as COMPUTED).config.as}'`,
                `'${(dataType as COMPUTED).config.type}'`
            ].join(', ')})`

            // ----------------------------------------------------------------

            case "json-ref": return `(${[
                `'${name}'`,
                this.dataType((dataType as JSONReference).dataType),
                inspect((dataType as JSONReference).config)
            ].join(', ')})`
        }
    }

    // ------------------------------------------------------------------------

    private dataType(dataType: DataType): string {
        switch (dataType.type) {
            case "char": return `DataType.CHAR(${this.dataTypeArgs(dataType)})`
            case "varchar": return `DataType.VARCHAR(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "text":
            case "tinytext":
            case "mediumtext":
            case "longtext": return `DataType.TEXT(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "int":
            case "tinyint":
            case "smallint":
            case "mediumint":
            case "bigint": return `DataType.INT(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "blob":
            case "tinyblob":
            case "mediumblob":
            case "longblob": return `DataType.BLOB(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "boolean": return `DataType.BOOLEAN()`
            case "date": return `DataType.DATE()`
            case "datetime": return `DataType.DATETIME()`
            case "timestamp": return `DataType.TIMESTAMP()`
            case "time": return `DataType.TIME()`
            case "year": return `DataType.YEAR()`
            case "json": return `DataType.JSON()`

            // ----------------------------------------------------------------

            case "decimal": return `DataType.DECIMAL(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "float": return `DataType.FLOAT(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "double": return `DataType.DOUBLE(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "bit": return `DataType.BIT(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "enum": return `DataType.ENUM(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "set": return `DataType.SET(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "binary": return `DataType.BINARY(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            case "varbinary": return `DataType.VARBINARY(${this.dataTypeArgs(
                dataType
            )})`

            // ----------------------------------------------------------------

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private dataTypeArgs(dataType: DataType): string {
        switch (dataType.type) {
            case "int":
            case "text":
            case "boolean":
            case "blob":
            case "date":
            case "datetime":
            case "timestamp":
            case "time":
            case "year":
            case "json": return ''

            // ----------------------------------------------------------------

            case "tinyint":
            case "smallint":
            case "mediumint":
            case "bigint":
            case "tinytext":
            case "mediumtext":
            case "longtext":
            case "tinyblob":
            case "mediumblob":
            case "longblob": return (
                `'${(dataType as INT | TEXT | BLOB).length}'`
            )

            // ----------------------------------------------------------------

            case "decimal":
            case "float":
            case "double": return `${[
                (dataType as DECIMAL | FLOAT | DOUBLE).M,
                (dataType as DECIMAL | FLOAT | DOUBLE).D
            ].join(', ')}`

            // ----------------------------------------------------------------

            case "char":
            case "varchar":
            case "binary":
            case "varbinary":
            case "bit": return `${(dataType as (
                CHAR | VARCHAR | BINARY | VARBINARY | BIT
            )).length}`

            // ----------------------------------------------------------------

            case "enum":
            case "set": return `${(dataType as ENUM | SET).options
                .map(o => `'${o}'`)
                .join(', ')}`

            // ----------------------------------------------------------------

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private idName(sequencial: boolean = false): string {
        const name = this.schema.name === 'id' ? '' : inspect(this.schema.name)
        return sequencial && name ? `, ${name}` : name
    }

    // ------------------------------------------------------------------------

    private propsImplements(): string {
        const implementation: string[] = []
        const { defaultValue, ...rest } = this.toChangeProperties()

        implementation.push(...Object.entries(rest).flatMap(
            ([key, value]) => value !== undefined
                ? `.${key}(${this.propImplementArgs(value)})`
                : []
        ))

        if (
            defaultValue !== undefined &&
            defaultValue !== this.previous?.map.defaultValue
        ) (
            implementation.push(`.default(${defaultValue})`)
        )

        implementation.concat(this.constraintImplements())

        return ModuleStringHelper.indentMany(implementation)
    }

    // ------------------------------------------------------------------------

    private constraintImplements(): string[] {
        const hasConstraint = !!this.schema.map.references
        const hasPrevious = !!this.previous?.map.references
        const implementation: string[] = []

        switch (true) {
            case hasConstraint && !hasPrevious: implementation.push(
                `.constrained()`
            )
                break

            case hasConstraint && hasPrevious: implementation.push(
                `.alterConstraint()`
            )
                break

            case !hasConstraint && hasPrevious: implementation.push(
                `.dropConstraint()`
            )
                break

            default: return implementation
        }

        if (hasConstraint) {
            const { tableName, columnName, onUpdate, onDelete } = (
                this.toChangeConstraintProps()
            )

            if (tableName || columnName) implementation.push(
                `.references('${tableName}', '${columnName}')`
            )

            if (onUpdate) implementation.push(`.onUpdate('${onUpdate}')`)
            if (onDelete) implementation.push(`.onDelete('${onDelete}')`)
        }

        return implementation
    }

    // ------------------------------------------------------------------------

    private propImplementArgs(value: any): string {
        return value && !this.previous ? '' : inspect(value)
    }

    // ------------------------------------------------------------------------

    private toChangeProperties(): Partial<ColumnSchemaMap> {
        const exclude = ['columnType', 'isForeignKey', 'references']

        return Object.fromEntries(Object.entries(this.schema.map).filter(
            ([key, value]) => !exclude.includes(key) && (
                !this.previous ||
                value !== this.previous.map[key as keyof ColumnSchema['map']]
            )
        ))
    }

    // ------------------------------------------------------------------------

    private toChangeConstraintProps(): Partial<ForeignKeyReferencesSchemaMap> {
        return this.previous
            ? Object.fromEntries(
                Object.entries(this.schema.map.references!.map)
                    .filter(
                        ([key, value]) => (
                            value !== this.previous?.map.references?.map[
                            key as keyof ForeignKeyReferencesSchema['map']
                            ]
                        )
                    )
            )
            : this.schema.map.references?.map ?? {}
    }
}