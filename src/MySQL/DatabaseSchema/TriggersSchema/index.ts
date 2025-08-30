import { Trigger } from "../../Triggers"
import TriggerSchema, { type TriggerSchemaInitMap } from "./TriggerSchema"

// Static
import { triggersSchemaQuery } from "./static"

// Types
import type { Constructor } from "../../../types/General"
import type { TriggersMetadata } from "../../Metadata"
import type MySQLConnection from "../../Connection"

export default class TriggersSchema<
    T extends TriggerSchema = TriggerSchema
> extends Array<T> {
    protected previous?: TriggersSchema

    constructor(
        public connection: MySQLConnection,
        ...triggers: (T | TriggerSchemaInitMap)[]
    ) {
        super(...triggers.map(trigger => trigger instanceof TriggerSchema
            ? trigger
            : new TriggerSchema(trigger)
        ) as T[])
    }

    static get [Symbol.species]() {
        return Array
    }

    protected static get TriggerConstructor(): typeof TriggerSchema {
        return TriggerSchema
    }

    public findTrigger(name: string): TriggerSchema | undefined {
        return this.find(t => t.name === name)
    }

    // Protecteds -------------------------------------------------------------
    protected async previousSchemas(): (
        Promise<TriggersSchema>
    ) {
        if (this.previous) return this.previous

        this.previous = new TriggersSchema(
            this.connection,
            ...(await this.connection.query(
                TriggersSchema.triggersSchemaQuery(
                    this.connection.config.database
                ),
                undefined,
                {
                    logging: false
                }
            ))
        )

        return this.previous
    }

    // Static Meethods ========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadatas<T extends Constructor<TriggersSchema>>(
        this: T,
        connection: MySQLConnection,
        ...metadatas: TriggersMetadata[]
    ): InstanceType<T> {
        return new this(
            connection,
            ...metadatas.flatMap(metadata => metadata.map(
                constructor => new constructor(metadata.target)
            ))
                .map(trigger => (this as T & typeof TriggersSchema)
                    .TriggerConstructor
                    .buildFromTrigger(trigger)
                )
        ) as InstanceType<T>
    }

    // -------------------------------------------------------------------------

    public static triggersSchemaQuery = triggersSchemaQuery
}

export {
    TriggerSchema
}