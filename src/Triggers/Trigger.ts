import TriggerSQLBuilder from "../SQLBuilders/DatabaseSQLBuilders/TriggerSQLBuilder"

import { MetadataHandler, type EntityMetadata } from "../Metadata"

// Types
import type { Constructor } from "../types/General"
import type BaseEntity from "../BaseEntity"

export default abstract class Trigger<
    T extends BaseEntity = any
> extends TriggerSQLBuilder<T> {
    /** @internal */
    protected metadata: EntityMetadata

    constructor(public target: Constructor<T>) {
        super()
        this.metadata = MetadataHandler.loadMetadata(this.target) as (
            EntityMetadata
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get tableName(): string {
        return this.metadata.tableName
    }

    // ------------------------------------------------------------------------

    public get name(): string {
        return this.constructor.name.toLowerCase()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public async register(): Promise<void> {
        if (!this.metadata.connection) throw new Error
        await this.metadata.connection.query(this.dropSQL())
        await this.metadata.connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public async drop(): Promise<void> {
        if (!this.metadata.connection) throw new Error
        await this.metadata.connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public async alter(): Promise<void> {
        await this.drop()
        await this.register()
    }
}