import TriggerActionBuilder
    from "../../../Triggers/TriggerActionBuilder"

// SQL Builders
import CreateSQLBuilder from "../../CreateSQLBuilder"
import UpdateSQLBuilder, { type UpdateAttributes } from "../../UpdateSQLBuilder"
import DeleteSQLBuilder from "../../DeleteSQLBuilder"

// Symbols
import { Old } from "../../../Triggers"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { Constructor } from "../../../../types/General"
import type BaseEntity from "../../../BaseEntity"
import type {
    TriggerTiming,
    TriggerEvent,
    TriggerOrientation,
    TriggerAction,
    TriggerActionOptions,
    SetAction,
    InsertIntoTableAction,
    UpdateTableAction,
    DeleteFromAction,
} from "../../../Triggers/types"

export default abstract class TriggerSQLBuilder<
    T extends BaseEntity
> extends TriggerActionBuilder<Constructor<T>> {
    public abstract timing?: TriggerTiming
    public abstract event?: TriggerEvent
    public abstract orientation?: TriggerOrientation

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public abstract get name(): string

    // ------------------------------------------------------------------------

    public abstract get tableName(): string

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------  
    protected abstract action(): string | TriggerAction<T>[]

    // Protecteds -------------------------------------------------------------
    protected createSQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CREATE TRIGGER ${this.name}
            ${this.timing} ${this.event} ON ${this.tableName}
            FOR EACH ${this.orientation}
            ${this.actionSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    protected alterSQL(): string {
        return `${this.createSQL()}; ${this.alterSQL()}`
    }

    // ------------------------------------------------------------------------

    protected dropSQL(): string {
        return `DROP TRIGGER ${this.name}`
    }

    // ------------------------------------------------------------------------

    public actionSQL(): string {
        return SQLStringHelper.normalizeSQL(
            `BEGIN ${this.actionBodySQL()} END`
        )
    }

    // Privates ---------------------------------------------------------------
    private actionBodySQL(): string {
        const action = this.action()
        if (typeof action === 'string') return action

        return action
            .map((action) => this.handleActionSQL(action)).join('; ')
            + ';'
    }

    // ------------------------------------------------------------------------

    private handleActionSQL(action: TriggerAction<T>): string {
        if (typeof action === 'string') return action

        switch (action.type) {
            case "SET": return this.setSQL(action as (
                SetAction<T>
            ))

            case "INSERT INTO": return this.insertIntoSQL(action as (
                InsertIntoTableAction
            ))

            case "UPDATE TABLE": return this.updateTableSQL(action as (
                UpdateTableAction
            ))

            case "DELETE FROM": return this.deleteFromSQL(action as (
                DeleteFromAction
            ))
        }
    }

    // ------------------------------------------------------------------------

    private setSQL({ attributes }: SetAction<T>): string {
        return `SET ${this.setValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    private insertIntoSQL({ target, attributes }: InsertIntoTableAction): (
        string
    ) {
        return new CreateSQLBuilder(
            target,
            attributes,
            undefined,
            true
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private updateTableSQL({ target, attributes, where }: UpdateTableAction): (
        string
    ) {
        return new UpdateSQLBuilder(
            target,
            attributes,
            where
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private deleteFromSQL({ target, where }: DeleteFromAction): string {
        return new DeleteSQLBuilder(
            target,
            where
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private setValuesSQL(config: TriggerActionOptions<UpdateAttributes<T>>): (
        string
    ) {
        return Object.entries(config).map(
            ([column, value]) => (
                typeof value === 'object' &&
                Object.getOwnPropertySymbols(value).includes(Old)
            )

                ? `NEW.${column} = ${value![Old as keyof typeof value]}`
                : `NEW.${column} = ${PropertySQLHelper.valueSQL(value)}`
        )
            .join(', ')

    }
}