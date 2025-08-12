import type { EntityTarget } from "../../types/General"
import type {
    CreationAttributesOptions,
    UpdateAttributes,
    ConditionalQueryOptions
} from "../QueryBuilder"

export type TriggerTiming = 'BEFORE' | 'AFTER' | 'INSTEAD OF'
export type TriggerEvent = 'INSERT' | 'UPDATE' | 'DELETE'
export type TriggerScope = 'ROW' | 'STATEMENT'

export type TriggerActionType = (
    'SET' |
    'INSERT INTO' |
    'UPDATE TABLE' |
    'DELETE FROM'
)

export type InsertIntoTableAction<T extends EntityTarget = any> = {
    target: T,
    attributes: CreationAttributesOptions<InstanceType<T>>
}

export type UpdateTableAction<T extends EntityTarget = any> = {
    target: T
    attributes: UpdateAttributes<InstanceType<T>>,
    where?: ConditionalQueryOptions<InstanceType<T>>
}

export type DeleteFromAction<T extends EntityTarget = any> = {
    target: T
    where: ConditionalQueryOptions<InstanceType<T>>
}

export type TriggerAction<
    T extends EntityTarget,
    Type extends TriggerActionType
> = string | [
    Type,
    Type extends 'SET'
    ? UpdateAttributes<InstanceType<T>>
    : Type extends 'INSERT INTO'
    ? InsertIntoTableAction
    : Type extends 'UPDATE TABLE'
    ? UpdateTableAction
    : Type extends 'DELETE FROM'
    ? DeleteFromAction
    : never
]