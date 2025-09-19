// Config
import Config from "../Config"

// Metadata
import { EntityMetadata } from "../Metadata"

// Database Schema
import DatabaseSchema, { type ActionType } from "../DatabaseSchema"

// Migrators
import DatabaseMigrator from "./DatabaseMigrator"

// Migration
import Migration from "./Migration"

// Handlers
import MigrationFileHandler from "./MigrationFileHandler"
import MigrationsTableHandler, { MigrationData } from "./MigrationsTableHandler"

// Utils
import { join } from "path"
import { readdirSync } from "fs"
import { pathToFileURL } from "url"
import readline from 'readline'
import chalk from "chalk"

// Types
import type MySQLConnection from "../Connection"
import type { Constructor } from "../types/General"
import type { MigrationRunMethod, MigrationSyncAction } from "./types"

export default class Migrator extends Array<Constructor<Migration>> {
    private static readonly registerUnknownQuestion = chalk.yellow(
        'You have unregistered migrations for this connection, would you like to register? [Y]es | [N]o\n'
    )

    private database!: DatabaseSchema | DatabaseMigrator

    private _metadatas?: EntityMetadata[]

    private _tableHandler?: MigrationsTableHandler
    private _fileHandler?: MigrationFileHandler

    private _files?: string[]
    private _registers?: string[]

    constructor(private connection: MySQLConnection) {
        super()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get metadatas(): EntityMetadata[] {
        if (this._metadatas) return this._metadatas

        return this._metadatas = this.connection.entities.map(
            entity => EntityMetadata.find(entity)!
        )
    }

    // ------------------------------------------------------------------------

    private get tableHandler(): MigrationsTableHandler {
        if (this._tableHandler) return this._tableHandler
        return this._tableHandler = new MigrationsTableHandler(this.connection)
    }

    // ------------------------------------------------------------------------

    private get fileHandler(): MigrationFileHandler {
        if (this._fileHandler) return this._fileHandler
        return this._fileHandler = new MigrationFileHandler(this.connection)
    }

    // ------------------------------------------------------------------------

    private get dir(): string {
        return join(Config.migrationsDir, this.connection.name)
    }

    // ------------------------------------------------------------------------

    private get files(): string[] {
        if (this._files) return this._files

        return this._files = readdirSync(this.dir)
            .filter(name => MigrationFileHandler.extensions.some(
                ext => name.endsWith(ext)
            ))
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species]() {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async init(): Promise<void> {
        await this.tableHandler.drop()
        return this.tableHandler.create()
    }

    // ------------------------------------------------------------------------

    public async reset(): Promise<void> {
        await this.verifyUnknown()
        await this.loadDatabaseSchema()

        await DatabaseMigrator.buildFromSchema(this.database).dropAll()
        await this.tableHandler.unsetMigratedAll()

        await this.run()
    }

    // ------------------------------------------------------------------------

    public async run(): Promise<void> {
        await this.verifyUnknown()
        if (!this.database) await this.loadDatabaseSchema()
        await this.loadMigrations('run')

        const migrator = new DatabaseMigrator(this.connection)
        const time = await this.tableHandler.nextMigrationTime()

        for (const Migration of this) {
            console.log(`Running up migration: ${Migration.name}`)

            new Migration(migrator).up()

            await migrator.executeActions(true)
            await this.tableHandler.setMigrated(Migration.name, time)
        }

        await migrator.executeTriggersActions()
    }

    // ------------------------------------------------------------------------

    public async back(): Promise<void> {
        await this.verifyUnknown()
        await this.loadDatabaseSchema()
        await this.loadMigrations('back')

        const migrator = DatabaseMigrator.buildFromSchema(this.database)

        for (const Migration of this.reverse()) {
            console.log(`Running down migration: ${Migration.name}`)

            new Migration(migrator).down()

            await migrator.executeActions(true)
            await this.tableHandler.unsetMigrated(Migration.name)
        }

        await migrator.executeTriggersActions()
    }

    // ------------------------------------------------------------------------

    public async sync(): Promise<void> {
        await this.verifyUnknown()
        await this.loadMigrations()

        this.database = new DatabaseSchema(this.connection)
        const schema = DatabaseSchema.buildFromConnectionMetadata(
            this.connection
        )

        for (const migration of await this.instantiate()) migration.up()

        await this.syncMigrations(schema)
    }

    // ------------------------------------------------------------------------

    public async create(
        action: ActionType,
        tableName: string,
        className?: string,
        at?: number
    ) {
        const [props] = await this.tableHandler.insert(
            className ?? this.buildClassName(action, tableName),
            at
        )

        this.fileHandler.create(this.connection.name, action, tableName, props)
    }

    // ------------------------------------------------------------------------

    public async registerUnknown(): Promise<void> {
        const registered = await this.registered()
        const unknown = this.files.filter(
            file => !registered.includes(file.split('.')[0])
        )

        if (unknown.length === 0) return

        const last = registered.length
        for (const file of unknown) {
            const [order, name, ...rest] = file
                .split('.')[0]
                .split('-')

            if (!order) throw new Error
            if (!name) throw new Error

            const at = parseInt(order)
            const createdAt = rest.length === 3 ? rest.join('-') : undefined

            if (createdAt && isNaN(new Date(createdAt).getTime())) throw (
                new Error
            )

            await this.tableHandler.insert(
                name,
                at <= last ? at : undefined,
                createdAt
            )
        }
    }

    // ------------------------------------------------------------------------

    public async delete(id: string | number): Promise<void> {
        const deleted = await this.tableHandler.delete(id)
        this.fileHandler.delete(deleted)
    }

    // ------------------------------------------------------------------------

    public async move(from: number, to: number): Promise<void> {
        await this.tableHandler.move(from, to)
        this.fileHandler.move(from, to)
    }

    // Privates ---------------------------------------------------------------
    private async instantiate(): Promise<Migration[]> {
        return this.map(migration => new migration(this.database))
    }

    // ------------------------------------------------------------------------

    private async registered(): Promise<string[]> {
        if (this._registers) return this._registers
        return this._registers = (await this.tableHandler.findAll()).map(
            ({ fileName }) => fileName
        )
    }

    // ------------------------------------------------------------------------

    private async loadDatabaseSchema(): Promise<void> {
        this.database = await DatabaseSchema.buildFromDatabase(this.connection)
        this.database.splice(
            this.database.findIndex(
                ({ name }) => name === MigrationsTableHandler.tableName
            ),
            1
        )
    }

    // ------------------------------------------------------------------------

    private async verifyUnknown(): Promise<void> {
        const registered = await this.registered()

        if (
            this.files.some(file => !registered.includes(file.split('.')[0]))
        ) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            })

            return new Promise(resolve => rl.question(
                Migrator.registerUnknownQuestion,
                async answer => {
                    if (answer.toLowerCase().startsWith('y')) (
                        await this.registerUnknown()
                    )

                    rl.close()
                    resolve()
                }
            ))
        }
    }

    // ------------------------------------------------------------------------

    private async loadMigrations(method?: MigrationRunMethod): Promise<void> {
        const included = method
            ? await this.included(method)
            : undefined

        const files = included
            ? this.files.filter(name => included.includes(name.split('.')[0]))
            : this.files

        this.push(...await Promise.all(
            files.map(async file =>
                (await import(pathToFileURL(join(this.dir, file)).href))
                    .default
            )
        ))
    }

    // ------------------------------------------------------------------------

    private async included(method: MigrationRunMethod): (
        Promise<string[]>
    ) {
        switch (method) {
            case "run": return (await this.tableHandler.toRoll())
                .map(({ fileName }) => fileName)

            case "back": return (await this.tableHandler.toRollback())
                .map(({ fileName }) => fileName)
        }
    }

    // ------------------------------------------------------------------------

    private async syncMigrations(schema: DatabaseSchema): Promise<void> {
        for (const [action, [table, prev]] of
            this.syncMigrationsActions(schema)
        ) {
            const [props] = await this.tableHandler.insert(
                this.buildClassName(action, table.name)
            )

            this.fileHandler.sync(
                this.connection.name,
                this.findTableMetaOrThrow(table.name),
                [table, prev],
                action,
                props
            )
        }
    }

    // ------------------------------------------------------------------------

    private syncMigrationsActions(schema: DatabaseSchema): (
        MigrationSyncAction[]
    ) {
        return this.toSyncAlterActions(schema).concat(
            this.toSyncDropActions(schema)
        )
    }

    // ------------------------------------------------------------------------

    private toSyncAlterActions(schema: DatabaseSchema): MigrationSyncAction[] {
        return schema.flatMap(table => {
            const prev = this.database.findTable(table.name)
            const action = table.compare(prev) as ActionType

            return action !== 'NONE'
                ? [[action, [table, prev]]]
                : []
        })
    }

    // ------------------------------------------------------------------------

    private toSyncDropActions(schema: DatabaseSchema): MigrationSyncAction[] {
        return this.database
            .filter(({ name }) => !schema.findTable(name))
            .map(table => ['DROP', [table, undefined]])
    }

    // ------------------------------------------------------------------------

    private findTableMetaOrThrow(tableName: string): EntityMetadata {
        const meta = this.metadatas.find(meta => meta.tableName === tableName)
        if (!meta) throw new Error

        return meta
    }

    // ------------------------------------------------------------------------

    private buildClassName(action: ActionType, tableName: string): string {
        return this.toPascalCase(
            action.toLocaleLowerCase(),
            tableName,
            'table',
            '_' + Date.now()
        )
    }

    // ------------------------------------------------------------------------

    private toPascalCase(...parts: string[]): string {
        return parts
            .flatMap(part => part.match(/[A-Z]?[a-z_]+|[0-9_]+/g) ?? [])
            .map(part =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join('')
    }
}

export {
    Migration
}