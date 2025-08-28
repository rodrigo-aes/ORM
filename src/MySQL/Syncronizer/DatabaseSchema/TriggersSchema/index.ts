import { Trigger } from "../../../Triggers"
import TriggerSchema, { type TriggerSchemaInitMap } from "./TriggerSchema"

// Static
import { triggersSchemaQuery } from "./static"

// Types
import type { TriggersMetadata } from "../../../Metadata"
import type MySQLConnection from "../../../Connection"

export default class TriggersSchema extends Array<TriggerSchema> {
    private previous?: TriggersSchema

    constructor(
        public connection: MySQLConnection,
        ...triggers: (Trigger | TriggerSchemaInitMap)[]
    ) {
        super(...triggers.map(trigger => trigger instanceof Trigger
            ? TriggerSchema.buildFromTrigger(trigger)
            : new TriggerSchema(trigger)
        ))
    }

    static get [Symbol.species]() {
        return Array
    }

    // Intance Methods ========================================================
    // Publics ----------------------------------------------------------------
    public async reset(): Promise<void> {
        (await this.previousSchemas()).dropAll()
        await this.createAll()
    }

    // ------------------------------------------------------------------------

    public async alter(): Promise<void> {
        await this.dropInexistents()

        for (const trigger of this) await trigger.executeAction(
            this.connection,
            (await this.previousSchemas()).findTrigger(trigger.name)
        )
    }

    // ------------------------------------------------------------------------

    public async createAll(): Promise<void> {
        for (const trigger of this) await trigger.create(this.connection)
    }

    // ------------------------------------------------------------------------

    public async dropAll(): Promise<void> {
        for (const trigger of (await this.previousSchemas())) (
            await trigger.drop(this.connection)
        )
    }

    // ------------------------------------------------------------------------

    public findTrigger(name: string): TriggerSchema | undefined {
        return this.find(t => t.name === name)
    }

    // Privates ---------------------------------------------------------------
    private async previousSchemas(): (
        Promise<TriggersSchema>
    ) {
        if (this.previous) return this.previous

        this.previous = new TriggersSchema(
            this.connection,
            ...(await this.connection.query(
                triggersSchemaQuery(this.connection.config.database)
            ))
        )

        return this.previous
    }

    // ------------------------------------------------------------------------

    private async dropInexistents(): Promise<void> {
        for (const trigger of ((await this.previousSchemas()).filter(
            ({ name }) => !this.findTrigger(name)
        ))) (
            await trigger.drop(this.connection)
        )
    }

    // Static Meethods ========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadatas(
        connection: MySQLConnection,
        ...metadatas: TriggersMetadata[]
    ): TriggersSchema {
        return new TriggersSchema(
            connection,
            ...metadatas.flatMap(metadata => metadata.map(
                constructor => new constructor(metadata.target)
            ))
        )
    }
}