// Utils
import { renameSync, existsSync, readdirSync, unlinkSync } from "fs"
import { join } from "path"

// Config
import Config from "../../Config"

// Template
import { MigrationTemplate } from "../../ModuleTemplates"

// Types
import type MySQLConnection from "../../Connection"
import type { EntityMetadata } from "../../Metadata"
import type { TableSchema } from "../../DatabaseSchema"
import type { MigrationData } from "../MigrationsTableHandler"
import type { ActionType } from "../../DatabaseSchema"

export default class MigrationFileHandler {
    private readonly BASE_DIR = Config.migrationsDir
    public static readonly extensions: string[] = [
        '.ts', '.js', '.cts', '.cjs', '.mts', '.mjs'
    ]

    private _files?: string[]

    constructor(private connection: MySQLConnection) { }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get dir(): string {
        return this.connection.name
    }

    // ------------------------------------------------------------------------

    public get absolute(): string {
        return join(this.BASE_DIR, this.dir)
    }

    // ------------------------------------------------------------------------

    public get files(): string[] {
        if (this._files) return this._files
        return this._files = readdirSync(join(this.BASE_DIR, this.dir))
    }

    // ------------------------------------------------------------------------

    public get orderedFiles(): [number, string][] {
        return this.files.map(file => [parseInt(file.charAt(0)), file])
    }

    // ------------------------------------------------------------------------

    public get lastOrder(): number {
        return this.orderedFiles[this.orderedFiles.length - 1][0]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(
        dir: string,
        action: ActionType,
        tableName: string,
        properties: MigrationData,
    ): void {
        const { order, name, fileName } = properties

        if (order <= this.lastOrder) this.incrementOrder(order, Infinity)

        return new MigrationTemplate(
            dir,
            name,
            fileName,
            action,
            tableName
        )
            .create()
    }

    // ------------------------------------------------------------------------

    public delete(deleted: number): void {
        const [_, file] = this.orderedFiles.find(
            ([order]) => order === deleted
        )!

        unlinkSync(join(this.absolute, file))
        this.decrementOrder(deleted, Infinity)
    }

    // ------------------------------------------------------------------------

    public sync(
        dir: string,
        metadata: EntityMetadata,
        [schema, prevSchema]: [TableSchema, TableSchema | undefined],
        action: ActionType,
        properties: MigrationData
    ): void {
        const { name, fileName } = properties

        return new MigrationTemplate(
            dir,
            name,
            fileName,
            action,
            schema.name
        )
            .sync(metadata, schema, prevSchema)
            .create()
    }

    // ------------------------------------------------------------------------

    public move(from: number, to: number): void {
        if (from === to) return

        const file = this.orderedFiles.find(([order]) => order === from)
        if (!file) throw new Error

        const [_, name] = file
        const tempName = this.removeOrder(name)

        if (from > to) this.incrementOrder(from, to)
        else this.decrementOrder(from, to)

        this.addOrder(tempName, to)
    }

    // Privates ---------------------------------------------------------------
    private incrementOrder(from: number, to: number): void {
        for (const [order, file] of this.orderedFiles
            .filter(([order]) => order >= to && order < from)
            .reverse()
        ) (
            renameSync(
                join(this.absolute, file),
                join(this.absolute, (order + 1) + file.slice(1))
            )
        )
    }

    // ------------------------------------------------------------------------

    private decrementOrder(from: number, to: number): void {
        for (const [order, file] of this.orderedFiles
            .filter(([order]) => order <= to && order > from)
            .reverse()
        ) (
            renameSync(
                join(this.absolute, file),
                join(this.absolute, (order - 1) + file.slice(1))
            )
        )
    }

    // ------------------------------------------------------------------------

    private addOrder(name: string, order: number): string {
        const added = order + name
        renameSync(
            join(this.absolute, name),
            join(this.absolute, added)
        )

        return added
    }

    // ------------------------------------------------------------------------

    private removeOrder(name: string): string {
        const removed = name.slice(1)
        renameSync(
            join(this.absolute, name),
            join(this.absolute, removed)
        )

        return removed
    }
}