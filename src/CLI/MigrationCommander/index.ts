import Command from "../Command"

// Config
import Config from "../../Config"

// Metadata
import { ConnectionsMetadata } from "../../Metadata"

// Migrator
import Migrator from "../../Migrator"

// Types
import type { Connection } from "../../Metadata/ConnectionsMetadata/types"
import type { MigrationCommanderMethod } from "./types"

export default class MigrationCommander extends Command {
    constructor(protected method?: MigrationCommanderMethod) {
        super(method)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async execute(): Promise<void> {
        switch (this.method) {
            case 'create': return
            case 'sync': return this.executeSync()
        }
    }

    // Protecteds -------------------------------------------------------------
    protected define(): void {
        switch (this.method) {
            case 'sync': this.syncDefine()
                break
        }
    }

    // Privates ---------------------------------------------------------------
    private async getConnections(): Promise<Connection[]> {
        await Config.createConnections()

        if (this.opts.connections) return this.opts.connnection.split(',').map(
            (name: string) => {
                const connection = ConnectionsMetadata.get(name)
                if (!connection) throw new Error

                return connection
            }
        )

        return ConnectionsMetadata.all()
    }

    // ------------------------------------------------------------------------

    private syncDefine(): void {
        this.option('connections', 'string')
    }

    // ------------------------------------------------------------------------

    private async executeSync(): Promise<void> {
        for (const connection of await this.getConnections()) {
            await new Migrator(connection).sync()
            connection.close()
        }
    }
}