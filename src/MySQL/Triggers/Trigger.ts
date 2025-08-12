import { MetadataHandler, type EntityMetadata } from "../Metadata"

// SQL Builders
import {
    CreateSQLBuilder,
    UpdateSQLBuilder,
    DeleteSQLBuilder
} from "../QueryBuilder"

// Symbols
import { Old, New } from "./Symbols"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../Helpers"

// Types
import type { EntityTarget } from "../../types/General"

import type {
    TriggerTiming,
    TriggerEvent,
    TriggerScope,
    TriggerActionType,
    TriggerAction,
    InsertIntoTableAction,
    UpdateTableAction,
    DeleteFromAction,
} from "./types"

import type {
    UpdateAttributes,
    CreationAttributesOptions,
    ConditionalQueryOptions
} from "../QueryBuilder"

export default abstract class Trigger<T extends EntityTarget> {
    private metadata: EntityMetadata

    public abstract timing: TriggerTiming
    public abstract event: TriggerEvent
    public abstract scope: TriggerScope

    constructor(public target: T) {
        this.metadata = MetadataHandler.loadMetadata(this.target) as (
            EntityMetadata
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return (
            this.constructor.name.charAt(0).toLowerCase() +
            this.constructor.name.slice(1)
        )
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.metadata.tableName
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public abstract action(): string | TriggerAction<T, TriggerActionType>[]

    // ------------------------------------------------------------------------

    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CREATE TRIGGER ${this.name}
            ${this.timing} ${this.event} ON ${this.tableName}
            FOR EACH ${this.scope}
            BEGIN ${this.actionSQL()} END;
        `)
    }

    // Protecteds -------------------------------------------------------------
    protected set(attributes: UpdateAttributes<InstanceType<T>>): (
        ['SET', UpdateAttributes<InstanceType<T>>]
    ) {
        return ['SET', attributes]
    }

    // ------------------------------------------------------------------------

    protected insertInto<T extends EntityTarget = any>(
        target: T,
        attributes: CreationAttributesOptions<InstanceType<T>>
    ): ['INSERT INTO', InsertIntoTableAction<T>] {
        return [
            'INSERT INTO',
            {
                target,
                attributes
            }
        ]
    }

    // ------------------------------------------------------------------------

    protected updateTable<T extends EntityTarget = any>(
        target: T,
        attributes: UpdateAttributes<InstanceType<T>>,
        where?: ConditionalQueryOptions<InstanceType<T>>
    ): ['UPDATE TABLE', UpdateTableAction<T>] {

        return [
            'UPDATE TABLE',
            {
                target,
                attributes,
                where
            }
        ]
    }

    // ------------------------------------------------------------------------

    protected deleteFrom<T extends EntityTarget = any>(
        target: T,
        where: ConditionalQueryOptions<InstanceType<T>>
    ): ['DELETE FROM', DeleteFromAction<T>] {
        return [
            'DELETE FROM',
            {
                target,
                where
            }
        ]
    }

    // ------------------------------------------------------------------------

    protected old(column: string): { [Old]: string } {
        return { [Old]: `OLD.${column}` }
    }

    // ------------------------------------------------------------------------

    protected new(column: string): { [New]: string } {
        return { [New]: `NEW.${column}` }
    }

    // Privates ---------------------------------------------------------------
    private actionSQL(): string {
        const action = this.action()
        if (typeof action === 'string') return action

        return action.map((a) => {
            if (typeof a === 'string') return a

            const [type, config] = a
            switch (type) {
                case "SET": return this.setSQL(config as (
                    UpdateAttributes<InstanceType<T>>
                ))

                case "INSERT INTO": return this.insertIntoSQL(config as (
                    InsertIntoTableAction
                ))

                case "UPDATE TABLE": return this.updateTableSQL(config as (
                    UpdateTableAction
                ))

                case "DELETE FROM": return this.deleteFromSQL(config as (
                    DeleteFromAction
                ))
            }
        })
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private setSQL(config: UpdateAttributes<InstanceType<T>>): string {
        return `SET ${this.setValuesSQL(config)}`
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

    private setValuesSQL(config: UpdateAttributes<InstanceType<T>>): string {
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