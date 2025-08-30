import { MetadataHandler, type EntityMetadata } from "../Metadata"
import type BaseEntity from "../BaseEntity"

// SQL Builders
import {
    CreateSQLBuilder,
    UpdateSQLBuilder,
    DeleteSQLBuilder
} from "../SQLBuilders"

// Symbols
import { Old, New } from "./Symbols"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../Helpers"

// Types
import type { EntityTarget, Constructor } from "../../types/General"

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
} from "./types"

import type {
    UpdateAttributes,
    CreationAttributesOptions,
    ConditionalQueryOptions
} from "../SQLBuilders"

export default abstract class Trigger<T extends BaseEntity = any> {
    protected metadata: EntityMetadata

    public abstract timing: TriggerTiming
    public abstract event: TriggerEvent
    public abstract orientation: TriggerOrientation

    constructor(public target: Constructor<T>) {
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
    public abstract action(): (
        string | TriggerAction<T>[]
    )

    // ------------------------------------------------------------------------

    public async register(): Promise<void> {
        if (!this.metadata.connection) throw new Error
        await this.metadata.connection.query(this.SQL())
    }

    // ------------------------------------------------------------------------

    public async drop(): Promise<void> {
        if (!this.metadata.connection) throw new Error
        await this.metadata.connection.query(`DROP TRIGGER ${this.name}`)
    }

    // ------------------------------------------------------------------------

    public async alter(): Promise<void> {
        await this.drop()
        await this.register()
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            CREATE TRIGGER ${this.name}
            ${this.timing} ${this.event} ON ${this.tableName}
            FOR EACH ${this.orientation}
            ${this.actionBody()}
        `)
    }

    // ------------------------------------------------------------------------

    public actionBody(): string {
        return SQLStringHelper.normalizeSQL(`BEGIN ${this.actionSQL()} END`)
    }

    // Protecteds -------------------------------------------------------------
    protected set(attributes: TriggerActionOptions<UpdateAttributes<T>>): (
        SetAction<T>
    ) {
        return {
            type: 'SET',
            attributes
        }
    }

    // ------------------------------------------------------------------------

    protected insertInto<T extends EntityTarget = any>(
        target: T,
        attributes: TriggerActionOptions<
            CreationAttributesOptions<InstanceType<T>>
        >
    ): InsertIntoTableAction<T> {
        return {
            type: 'INSERT INTO',
            target,
            attributes
        }
    }

    // ------------------------------------------------------------------------

    protected updateTable<T extends EntityTarget = any>(
        target: T,
        attributes: TriggerActionOptions<
            UpdateAttributes<InstanceType<T>>
        >,
        where?: TriggerActionOptions<
            ConditionalQueryOptions<InstanceType<T>>
        >
    ): UpdateTableAction<T> {

        return {
            type: 'UPDATE TABLE',
            target,
            attributes,
            where
        }
    }

    // ------------------------------------------------------------------------

    protected deleteFrom<T extends EntityTarget = any>(
        target: T,
        where: TriggerActionOptions<
            ConditionalQueryOptions<InstanceType<T>>
        >
    ): DeleteFromAction<T> {
        return {
            type: 'DELETE FROM',
            target,
            where
        }
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

            const { type, ...config } = a
            switch (type) {
                case "SET": return this.setSQL(config as (
                    SetAction<T>
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
            .join('; ') + ';'
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