// Database Schema
import DatabaseSchema, { type ActionType } from "../DatabaseSchema"

// Migrators
import DatabaseMigrator from "./DatabaseMigrator"

// Migration
import Migration from "./Migration"

// Handlers
import MigrationHandler from "./MigrationHandler"

// Utils
import { resolve, join } from "path"
import { readdir } from "fs/promises"
import { pathToFileURL } from "url";

// Types
import type MySQLConnection from "../Connection"
import type { Constructor } from "../../types/General"

export default class Migrator extends Array<Constructor<Migration>> {
    private readonly baseDir = resolve('src/TestTools/Migrations')

    private database!: DatabaseSchema | DatabaseMigrator
    private handler: MigrationHandler

    constructor(
        private connection: MySQLConnection
    ) {
        super()
        this.handler = new MigrationHandler(this.connection)
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get dir(): string {
        return `${this.baseDir}/${this.connection.name}`
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async roll(): Promise<void> {
        await this.loadDependencies('roll')
        for (const migration of await this.instantiate()) migration.up()

        return this.databaseToMigrator().migrate()
    }

    // ------------------------------------------------------------------------

    public async rollback(): Promise<void> {
        await this.loadDependencies('rollback')
        for (const migration of await this.instantiate()) migration.down()

        return this.databaseToMigrator().migrate()
    }

    // ------------------------------------------------------------------------

    public async sync(): Promise<void> {
        this.push(...await this.readMigrationFiles('all'))
        this.database = new DatabaseSchema(this.connection)

        for (const migration of await this.instantiate()) migration.up()
        return this.handler.sync(this.database)
    }

    // ------------------------------------------------------------------------

    public async initMigrationService(): Promise<void> {
        return this.handler.init()
    }

    // ------------------------------------------------------------------------

    public async createMigration(action: ActionType, tableName: string): (
        Promise<void>
    ) {
        return this.handler.create(action, tableName)
    }

    // Privates ---------------------------------------------------------------
    private async loadDependencies(method: 'roll' | 'rollback' | 'all'): (
        Promise<void>
    ) {
        this.push(...await this.readMigrationFiles())
        this.database = await this.loadDatabaseSchema()
    }

    // ------------------------------------------------------------------------

    private async instantiate(): Promise<Migration[]> {
        return this.map(migration => new migration(this.database))
    }

    // ------------------------------------------------------------------------

    private loadDatabaseSchema(): Promise<DatabaseSchema> {
        return DatabaseSchema.buildFromDatabase(this.connection)
    }

    // ------------------------------------------------------------------------

    private databaseToMigrator(): DatabaseMigrator {
        return this.database = DatabaseMigrator.buildFromSchema(this.database)
    }

    // ------------------------------------------------------------------------

    private async readMigrationFiles(
        method: 'roll' | 'rollback' | 'all' = 'all'
    ): Promise<Constructor<Migration>[]> {
        const fileNames = await this.execTableMethod(method)

        let files = (await readdir(this.dir))
            .filter(name => name.endsWith(".js") || name.endsWith(".ts"))

        if (fileNames) files = files.filter(name => fileNames.includes(
            name.split('.')[0]
        ))

        return Promise.all(files.map(async file =>
            (await import(pathToFileURL(join(this.dir, file)).href))
                .default
        ))
    }

    // ------------------------------------------------------------------------

    private execTableMethod(method: 'roll' | 'rollback' | 'all'): (
        Promise<string[]> | undefined
    ) {
        switch (method) {
            case "roll": return this.handler.rollMigrations()
            case "rollback": return this.handler.rollbackMigrations()
        }
    }
}

export {
    Migration
}