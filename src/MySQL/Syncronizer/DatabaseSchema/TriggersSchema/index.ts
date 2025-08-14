// Helpers
import { SQLStringHelper } from "../../../Helpers"

// Types
import type MySQLConnection from "../../../Connection"
import type { TriggersMetadata } from "../../../Metadata"
import type { TriggerSchema, AlterTriggerAction } from "./types"
import type { Trigger } from "../../../Triggers"

export default class TriggersSchema extends Array<TriggerSchema> {
    constructor(
        private connection: MySQLConnection,
        private triggers: Trigger[]
    ) {
        super()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async reset(): Promise<void> {
        await this.loadSchema()
        await this.dropAll()
        await this.createAll()
    }

    // ------------------------------------------------------------------------

    public async alter(): Promise<void> {
        await this.loadSchema()

        for (const [action, source] of this.compare()) switch (action) {
            case 'ADD': await (source as Trigger).register()
                break

            case 'MODIFY': await (source as Trigger).alter()
                break

            case 'DROP': await this.drop(
                (source as TriggerSchema).TRIGGER_NAME
            )
                break
        }
    }

    // ------------------------------------------------------------------------

    public compare(): (
        [AlterTriggerAction, Trigger | TriggerSchema]
    )[] {
        return [
            ...this.toAdd(),
            ...this.toModify(),
            ...this.toDrop()
        ]
    }

    // ------------------------------------------------------------------------

    public toAdd(): ([AlterTriggerAction, Trigger | TriggerSchema])[] {
        return this.triggers.flatMap(
            trigger => this.some(({ TRIGGER_NAME, EVENT_OBJECT_TABLE }) => (
                trigger.name === TRIGGER_NAME &&
                trigger.tableName === EVENT_OBJECT_TABLE
            ))
                ? []
                : [['ADD', trigger]]
        )
    }

    // ------------------------------------------------------------------------

    public toModify(): ([AlterTriggerAction, Trigger | TriggerSchema])[] {
        return this.triggers.flatMap(
            trigger => this.shouldModify(trigger)
                ? [['MODIFY', trigger]]
                : []
        )
    }

    // ------------------------------------------------------------------------

    public toDrop(): ([AlterTriggerAction, Trigger | TriggerSchema])[] {
        return this.flatMap(
            schema => this.triggers.some(
                ({ name, tableName }) => (
                    name === schema.TRIGGER_NAME &&
                    tableName === schema.EVENT_OBJECT_TABLE
                )
            )
                ? []
                : [['DROP', schema]]
        )
    }

    // Privates ---------------------------------------------------------------
    private async loadSchema(): Promise<void> {
        this.push(
            ...(await this.connection.query(this.schemaSQL()))
        )
    }

    // ------------------------------------------------------------------------

    private async createAll(): Promise<void> {
        for (const trigger of this.triggers) await trigger.register()
    }

    // ------------------------------------------------------------------------

    private async dropAll(): Promise<void> {
        for (const { TRIGGER_NAME } of this) await this.drop(TRIGGER_NAME)
    }

    // ------------------------------------------------------------------------

    private async drop(triggerName: string): Promise<void> {
        await this.connection.query(`DROP TRIGGER ${triggerName}`)
    }

    // ------------------------------------------------------------------------

    private shouldModify(trigger: Trigger): boolean {
        const { name, tableName, event, timing } = trigger

        return this.some(({
            TRIGGER_NAME,
            EVENT_OBJECT_TABLE,
            EVENT_MANIPULATION,
            ACTION_TIMING,
            ACTION_STATEMENT
        }) => {
            return (
                name === TRIGGER_NAME &&
                tableName === EVENT_OBJECT_TABLE && (
                    event !== EVENT_MANIPULATION ||
                    timing !== ACTION_TIMING ||
                    trigger.actionBody() !== ACTION_STATEMENT
                )
            )
        })
    }

    // ------------------------------------------------------------------------

    private schemaSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            SELECT 
                TRIGGER_NAME,
                EVENT_MANIPULATION,
                EVENT_OBJECT_TABLE,
                ACTION_STATEMENT,
                ACTION_TIMING,
                CREATED,
                SQL_MODE
            FROM information_schema.TRIGGERS
            WHERE TRIGGER_SCHEMA = '${this.connection.config.database}'    
        `)
    }
}