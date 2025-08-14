import type { EntityTarget } from "../../types/General"
import type { Old, New } from './Symbols'
import type {
    CreationAttributesOptions,
    UpdateAttributes,
    ConditionalQueryOptions
} from "../QueryBuilder"

export type TriggerTiming = 'BEFORE' | 'AFTER' | 'INSTEAD OF'
export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE'
export type TriggerForEachScope = 'ROW' | 'STATEMENT'

export type TriggerActionType = (
    'SET' |
    'INSERT INTO' |
    'UPDATE TABLE' |
    'DELETE FROM'
)

export type TriggerActionOptions<Options extends (
    CreationAttributesOptions<any> |
    UpdateAttributes<any> |
    ConditionalQueryOptions<any>
)> = {
        [K in keyof Options]: Options[K] | (
            { [Old]: string } |
            { [New]: string }
        )
    }

export type SetAction<T extends object> = {
    type: 'SET'
    attributes: TriggerActionOptions<
        UpdateAttributes<T>
    >
}

export type InsertIntoTableAction<T extends EntityTarget = any> = {
    type: 'INSERT INTO'
    target: T,
    attributes: TriggerActionOptions<
        CreationAttributesOptions<InstanceType<T>>
    >
}

export type UpdateTableAction<T extends EntityTarget = any> = {
    type: 'UPDATE TABLE'
    target: T
    attributes: TriggerActionOptions<
        UpdateAttributes<InstanceType<T>>
    >,
    where?: TriggerActionOptions<
        ConditionalQueryOptions<InstanceType<T>>
    >
}

export type DeleteFromAction<T extends EntityTarget = any> = {
    type: 'DELETE FROM'
    target: T
    where: TriggerActionOptions<
        ConditionalQueryOptions<InstanceType<T>>
    >
}

export type TriggerAction<T extends object> = (
    string |
    SetAction<T> |
    InsertIntoTableAction |
    UpdateTableAction |
    DeleteFromAction
)