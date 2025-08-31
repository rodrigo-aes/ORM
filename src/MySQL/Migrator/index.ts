// Database Schema
import DatabaseSchema, {
    type TableSchema,
    type ColumnSchema
} from "../DatabaseSchema"

// Migrators
import DatabaseMigrator, {
    TableMigrator,
    ColumnMigrator
} from "./DatabaseMigrator"

// Migration
import Migration from "./Migration"

// Types
import type MySQLConnection from "../Connection"
import type { Constructor } from "../../types/General"

export default class Migrator extends Array<Constructor<Migration>> {
    private database!: DatabaseSchema | DatabaseMigrator

    constructor(
        private connection: MySQLConnection,
        ...migrations: Constructor<Migration>[]
    ) {
        super(...migrations)
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async migrate(): Promise<void> {
        for (const migration of await this.instantiate()) migration.up()
        return this.databaseToMigrator().migrate()
    }

    // ------------------------------------------------------------------------

    public async rollback(): Promise<void> {
        for (const migration of await this.instantiate()) migration.down()
        return this.databaseToMigrator().migrate()
    }

    // Privates ---------------------------------------------------------------
    private async instantiate(): Promise<Migration[]> {
        await this.loadDependencies()
        return this.map(migration => new migration(this.database))
    }

    // ------------------------------------------------------------------------

    private async loadDependencies(): Promise<void> {
        this.database = await this.loadDatabaseSchema()
    }

    // ------------------------------------------------------------------------

    private loadDatabaseSchema(): Promise<DatabaseSchema> {
        return DatabaseSchema.buildFromDatabase(this.connection)
    }

    // ------------------------------------------------------------------------

    private databaseToMigrator(): DatabaseMigrator {
        return this.database = DatabaseMigrator.buildFromSchema(this.database)
    }
}

export {
    Migration
}