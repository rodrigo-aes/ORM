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
import type { ActionType } from "../../DatabaseSchema"

export default class MigrationCommander extends Command {
    constructor(protected method?: MigrationCommanderMethod) {
        super(method)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public execute(): Promise<void> {
        switch (this.method) {
            case 'init':
            case 'run':
            case 'back':
            case 'reset':
            case 'sync': return this.executeMethod()
            case 'register': return this.executeRegisterUnknown()
            case 'create': return this.executeCreate()
            case 'delete': return this.executeDelete()
            case 'move': return this.executeMove()

            default: throw new Error
        }
    }

    // Protecteds -------------------------------------------------------------
    protected define(): void {
        switch (this.method) {
            case 'sync': this.syncDefine()
                break

            case 'create': this.createDefine()
                break

            case 'delete': this.deleteDefine()
                break

            case 'move': this.moveDefine()
                break
        }
    }

    // Privates ---------------------------------------------------------------
    private async getConnections(): Promise<Connection[]> {
        await Config.createConnections()

        if (this.opts.connections) return this.opts.connnection
            .split(',')
            .map((name: string) => {
                const connection = ConnectionsMetadata.get(name)
                if (!connection) throw new Error

                return connection
            })

        return ConnectionsMetadata.all()
    }

    // ------------------------------------------------------------------------

    private syncDefine(): void {
        this.option('connections', 'string')
    }

    // ------------------------------------------------------------------------

    private createDefine(): void {
        this.arg(['create', 'alter', 'drop'])
        this.arg('<?>')
        this.option('name', 'string')
        this.option('atOrder', 'number')
        this.option('connections', 'string')
    }

    // ------------------------------------------------------------------------

    private deleteDefine(): void {
        this.arg('<?>')
        this.option('connections', 'string')
    }

    // ------------------------------------------------------------------------

    private moveDefine(): void {
        this.arg('<int>')
        this.arg('<int>')
        this.option('connections', 'string')
    }

    // ------------------------------------------------------------------------

    private async executeMethod(): Promise<void> {
        for (const connection of await this.getConnections()) {
            await new Migrator(connection)[this.method as (
                'init' | 'run' | 'back' | 'reset' | 'sync'
            )]()

            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeRegisterUnknown(): Promise<void> {
        for (const connection of await this.getConnections()) {
            await new Migrator(connection).registerUnknown()
            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeCreate(): Promise<void> {
        const [action, tableName] = this.args as ([
            string | undefined,
            string | undefined
        ])

        if (!action) throw new Error
        if (!tableName) throw new Error

        const { name, atOrder } = this.opts

        for (const connection of await this.getConnections()) {
            await new Migrator(connection).create(
                action.toUpperCase() as ActionType,
                tableName as string,
                name,
                atOrder
            )

            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeDelete(): Promise<void> {
        const [id] = this.args as [string | number | undefined]
        if (!id) throw new Error

        for (const connection of await this.getConnections()) {
            await new Migrator(connection).delete(id)
            await connection.close()
        }
    }

    // ------------------------------------------------------------------------

    private async executeMove(): Promise<void> {
        const [from, to] = this.args as ([
            number | undefined,
            number | undefined
        ])

        if (!from) throw new Error
        if (!to) throw new Error

        for (const connection of await this.getConnections()) {
            await new Migrator(connection).move(from, from)
            await connection.close()
        }
    }
}