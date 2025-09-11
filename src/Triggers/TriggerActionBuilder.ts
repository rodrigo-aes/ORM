// Symbols
import { Old, New } from "./Symbols"

// Types
import type { EntityTarget } from "../types/General"

import type {
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

export default abstract class TriggerActionBuilder<
    T extends EntityTarget
> {
    // Instance Methods =======================================================
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
}