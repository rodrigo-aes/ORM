// Metadata
import { DataType } from "../../Metadata"

// Migrators
import { TableMigrator, ColumnMigrator } from "../DatabaseMigrator"

// Procedures
import {
    InsertMigration,
    DeleteMigration,
    MigrateRollProcedure,
    MigrateRollbackProcedure,
} from "../../SQLBuilders"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type MySQLConnection from "../../Connection"
import type { MigrationProps, MigrationData } from "./types"

export default class MigrationsTable {
    private static tableName: string = '__migrations'

    constructor(private connection: MySQLConnection) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(): Promise<void> {
        return MigrationsTable.buildMigrator().create(this.connection)
    }

    // ------------------------------------------------------------------------

    public drop(): Promise<void> {
        return MigrationsTable.buildMigrator().drop(this.connection)
    }

    // ------------------------------------------------------------------------

    public async findOne(name: string): Promise<MigrationProps> {
        const [{ order, name: _name, fileName }] = await this.connection.query(
            MigrationsTable.findOneSQL(name)
        )

        return [order, _name, fileName]
    }

    // ------------------------------------------------------------------------

    public async insert(name: string, position?: number): (
        Promise<MigrationProps>
    ) {
        const [[{ order, name: _name, fileName }]] = await InsertMigration.call(
            this.connection,
            name,
            position
        )

        return [order, _name, fileName]
    }

    // ------------------------------------------------------------------------

    public async delete(name: string): Promise<void> {
        await DeleteMigration.call(this.connection, name)
    }

    // ------------------------------------------------------------------------

    public async roll(): Promise<MigrationData[]> {
        return await MigrateRollProcedure.call(this.connection)
    }

    // ------------------------------------------------------------------------

    public async rollback(at?: number): Promise<MigrationData[]> {
        return await MigrateRollbackProcedure.call(this.connection, at)
    }

    // Static Methods =========================================================
    // Privates ---------------------------------------------------------------
    private static findOneSQL(name: string): string {
        name = PropertySQLHelper.valueSQL(name)

        return SQLStringHelper.normalizeSQL(`
            SELECT \`order\`, \`name\`, \`fileName\` FROM ${this.name}
            WHERE \`name\` = ${name} OR \`fileName\` = ${name};
        `)
    }

    // ------------------------------------------------------------------------

    private static buildMigrator(): TableMigrator {
        const { tableName } = MigrationsTable

        return new TableMigrator(
            undefined,
            tableName,

            new ColumnMigrator({
                tableName,
                name: 'id',
                dataType: DataType.INT('BIG'),
                unsigned: true,
                autoIncrement: true,
                primary: true
            }),

            new ColumnMigrator({
                tableName,
                name: 'name',
                dataType: DataType.VARCHAR(),
                unique: true
            }),

            new ColumnMigrator({
                tableName,
                name: 'order',
                dataType: DataType.INT(),
                unique: true
            }),

            new ColumnMigrator({
                tableName,
                name: 'fileName',
                dataType: DataType.COMPUTED(
                    DataType.VARCHAR(),
                    `CONCAT(\`order\`, '-', \`name\`, '-',
                         DATE_FORMAT(\`createdAt\`, '%Y-%m-%d')
                    )
                    `,
                    "STORED"
                ),
            }),

            new ColumnMigrator({
                tableName,
                name: 'migrated',
                dataType: DataType.BOOLEAN(),
                defaultValue: false
            }),

            new ColumnMigrator({
                tableName,
                name: 'migratedTime',
                dataType: DataType.INT(),
                nullable: true,
                defaultValue: null
            }),

            new ColumnMigrator({
                tableName,
                name: 'migratedAt',
                dataType: DataType.TIMESTAMP(),
                nullable: true,
                defaultValue: null,
            }),

            new ColumnMigrator({
                tableName,
                name: 'createdAt',
                dataType: DataType.TIMESTAMP(),
                defaultValue: Date.now,
            }),

            new ColumnMigrator({
                tableName,
                name: 'updatedAt',
                dataType: DataType.TIMESTAMP(),
                defaultValue: Date.now,
            }),
        )
    }
}

export {
    type MigrationProps
}