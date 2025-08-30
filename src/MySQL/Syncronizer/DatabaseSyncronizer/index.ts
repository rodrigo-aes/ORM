import DatabaseSchema, { type TableSchema } from "../../DatabaseSchema"
import TableSyncronizer from "./TableSyncronizer"
import TriggersSyncronizer from "./TriggersSyncronizer";

import { EntityMetadata } from "../../Metadata";

export default class DatabaseSyncronizer extends DatabaseSchema<
    TableSyncronizer
> {
    protected override previous?: DatabaseSyncronizer;
    protected override triggers?: TriggersSyncronizer;

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    protected static override get TableConstructor(): typeof TableSchema {
        return TableSyncronizer as typeof TableSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async reset(): Promise<void> {
        await this.dropAll()
        await this.crateAll()
    }

    // ------------------------------------------------------------------------

    public async alter(): Promise<void> {
        await this.dropInexistents()

        for (const table of this) await table.executeAction(
            this.connection,
            (await this.previuosSchema()).findTable(table.name)
        )

        await this.triggersSchema().alter()
    }

    // ------------------------------------------------------------------------

    public async crateAll(): Promise<void> {
        for (const table of this) await table.create(this.connection)
        await this.triggersSchema().createAll()
    }

    // ------------------------------------------------------------------------

    public async dropAll(): Promise<void> {
        await this.triggersSchema().dropAll()

        for (const table of (await this.previuosSchema())) (
            await table.drop(this.connection)
        )
    }

    // ------------------------------------------------------------------------

    protected override async previuosSchema(): Promise<DatabaseSyncronizer> {
        if (this.previous) return this.previous

        this.previous = new DatabaseSyncronizer(
            this.connection,
            ...(await this.connection.query(
                DatabaseSyncronizer.databaseSchemaQuery,
                undefined,
                {
                    logging: false
                }
            ))
                .map(({ tableName, columns }) => new TableSyncronizer(
                    tableName, ...columns
                ))
        )

        return this.previous
    }

    // ------------------------------------------------------------------------

    protected override triggersSchema(): TriggersSyncronizer {
        if (this.triggers) return this.triggers

        this.triggers = TriggersSyncronizer.buildFromMetadatas(
            this.connection,
            ...this.connection.entities.flatMap(
                target => {
                    const meta = EntityMetadata.findOrBuild(target)
                    return meta.triggers ? [meta.triggers] : []
                }
            )
        )

        return this.triggers
    }


    // ------------------------------------------------------------------------

    private async dropInexistents(): Promise<void> {
        for (const table of (await this.previuosSchema()).filter(
            ({ name }) => !this.findTable(name)
        )) (
            await table.drop(this.connection)
        )
    }
}

export {
    TableSyncronizer,
    TriggersSyncronizer
}