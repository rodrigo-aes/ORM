import { TriggersSchema } from "../../../DatabaseSchema"
import TriggerSyncronizer from "./TriggerSyncronizer"

export default class TriggersSyncronizer extends TriggersSchema<
    TriggerSyncronizer
> {
    declare protected previous?: TriggersSyncronizer;

    protected static override get TriggerConstructor(): (
        typeof TriggerSyncronizer
    ) {
        return TriggerSyncronizer
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

    // Protecteds -------------------------------------------------------------
    protected override async previousSchemas(): Promise<TriggersSyncronizer> {
        if (this.previous) return this.previous

        this.previous = new TriggersSyncronizer(
            this.connection,
            ...(await this.connection.query(
                TriggersSyncronizer.triggersSchemaQuery(
                    this.connection.config.database
                )
            ))
                .map(initMap => new TriggerSyncronizer(initMap))
        )

        return this.previous
    }

    // Privates ---------------------------------------------------------------
    private async dropInexistents(): Promise<void> {
        for (const trigger of ((await this.previousSchemas()).filter(
            ({ name }) => !this.findTrigger(name)
        ))) (
            await trigger.drop(this.connection)
        )

    }
}