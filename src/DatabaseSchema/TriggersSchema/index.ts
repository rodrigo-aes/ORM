import TriggerSchema, { type TriggerSchemaInitMap } from "./TriggerSchema"

// Static
import { triggersSchemaQuery } from "./static"

// Types
import type { Constructor } from "../../types/General"
import type { TriggersMetadata, PolyORMConnection } from "../../Metadata"
import type { TriggersSchemaAction } from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class TriggersSchema<
    T extends TriggerSchema = TriggerSchema
> extends Array<T> {
    protected previous?: TriggersSchema
    public actions: TriggersSchemaAction[] = []

    constructor(
        public connection: PolyORMConnection,
        ...triggers: (T | TriggerSchemaInitMap)[]
    ) {
        super(...triggers.map(trigger => trigger instanceof TriggerSchema
            ? trigger
            : new TriggerSchema(trigger)
        ) as T[])
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species]() {
        return Array
    }

    // Protecteds -------------------------------------------------------------
    protected static get TriggerConstructor(): typeof TriggerSchema {
        return TriggerSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(tableName: string, name: string): T {
        const trigger = new TriggerSchema({ tableName, name }) as T

        this.push(trigger)
        this.actions.push(['CREATE', trigger])

        return trigger
    }

    // ------------------------------------------------------------------------

    public alter(tableName: string, name: string): T {
        const trigger = this.findOrThrow(tableName, name)
        this.actions.push(['ALTER', trigger])

        return trigger as T
    }

    // ------------------------------------------------------------------------

    public drop(tableName: string, name: string): void {
        const trigger = this.findOrThrow(tableName, name)
        this.actions.push(['DROP', trigger])
    }

    // ------------------------------------------------------------------------

    public findTrigger(tableName: string, name: string): (
        TriggerSchema | undefined
    ) {
        return this.find(t => t.tableName === tableName && t.name === name)
    }

    // Protecteds -------------------------------------------------------------
    protected findOrThrow(tableName: string, name: string): TriggerSchema {
        return this.findTrigger(tableName, name)!
            ?? PolyORMException.MySQL.throwOutOfOperation(
                'UNKNOWN_TRIGGER', tableName, name
            )
    }

    // ------------------------------------------------------------------------

    protected async previousSchema() {
        if (this.previous) return this.previous

        this.previous = new TriggersSchema(
            this.connection,
            ...await this.connection.query(
                TriggersSchema.triggersSchemaQuery(
                    this.connection.database
                ))

        )

        return this.previous
    }

    // Static Meethods ========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromMetadatas<T extends Constructor<TriggersSchema>>(
        this: T,
        connection: PolyORMConnection,
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