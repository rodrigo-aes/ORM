// Database Schema
import DatabaseSchema, { type ActionType } from "../../DatabaseSchema"

// Metadata
import { EntityMetadata } from "../../Metadata"

// Components
import MigrationsTable, { type MigrationProps } from "../MigrationsTable"
import MigrationFile from "../MigrationFile"

// Types
import type MySQLConnection from "../../Connection"

export default class MigrationHandler {
    private _table?: MigrationsTable

    constructor(private connection: MySQLConnection) { }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get connectionName(): string {
        return this.connection.name
    }

    // ------------------------------------------------------------------------

    private get table(): MigrationsTable {
        if (this._table) return this._table
        return this._table = new MigrationsTable(this.connection)
    }

    // ------------------------------------------------------------------------

    private get file(): MigrationFile {
        return new MigrationFile
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async init(): Promise<void> {
        return await this.table.create()
    }

    // ------------------------------------------------------------------------

    public async rollMigrations(): Promise<string[]> {
        return (await this.table.roll()).map(({ fileName }) => fileName)
    }

    // ------------------------------------------------------------------------

    public async rollbackMigrations(): Promise<string[]> {
        return (await this.table.rollback()).map(({ fileName }) => fileName)
    }

    // ------------------------------------------------------------------------

    public async create(
        action: ActionType,
        tableName: string,
        className?: string,
        at?: number
    ): Promise<void> {
        if (!className) className = this.toPascalCase(
            `${action.toLocaleLowerCase()}_${tableName}_table`
        )

        const props = await this.table.insert(className, at)
        this.file.create(this.connectionName, action, tableName, props)
    }

    // ------------------------------------------------------------------------

    public async sync(previousSchema: DatabaseSchema): Promise<void> {
        const metadatas = this.connectionMetadatas()
        const currentSchema = DatabaseSchema.buildFromConnectionMetadata(
            this.connection
        )

        await this.syncAlterTables(metadatas, currentSchema, previousSchema)
        await this.syncDropTables(metadatas, currentSchema, previousSchema)
    }

    // Private ----------------------------------------------------------------
    private connectionMetadatas(): EntityMetadata[] {
        return this.connection.entities.map(
            entity => EntityMetadata.find(entity)!
        )
    }

    // ------------------------------------------------------------------------

    private async syncAlterTables(
        metadatas: EntityMetadata[],
        currentSchema: DatabaseSchema,
        previousSchema: DatabaseSchema
    ): Promise<void> {
        for (const table of currentSchema) {
            const name = table.name
            const prevTable = previousSchema.findTable(name)

            const action = table.compare(prevTable) as ActionType
            if (action === 'NONE') continue

            const meta = metadatas.find(({ tableName }) => tableName === name)
            if (!meta) throw new Error

            const className = this.toPascalCase(
                `${action.toLocaleLowerCase()}_${name}_table`
            ) + `_${Date.now()}`

            const props = await this.table.insert(className)

            this.file.sync(
                this.connectionName,
                meta,
                [table, prevTable],
                action,
                name,
                props
            )
        }
    }

    // ------------------------------------------------------------------------

    private async syncDropTables(
        metadatas: EntityMetadata[],
        currentSchema: DatabaseSchema,
        previousSchema: DatabaseSchema
    ): Promise<void> {
        for (const table of previousSchema.filter(
            ({ name }) => !currentSchema.findTable(name)
        )) {
            const name = table.name

            const meta = metadatas.find(({ tableName }) => tableName === name)
            if (!meta) throw new Error

            const className = this.toPascalCase(`drop_${name}_table`) + (
                `_${Date.now()}`
            )

            const props = await this.table.insert(className)

            this.file.sync(
                this.connectionName,
                meta,
                [table, undefined],
                'DROP',
                name,
                props
            )
        }
    }

    // ------------------------------------------------------------------------

    private toPascalCase(name: string): string {
        return name
            .split('_')
            .flatMap(part => part.match(/[A-Z]?[a-z]+|[0-9]+/g) ?? [])
            .map(part =>
                part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
            )
            .join('')
    }
}