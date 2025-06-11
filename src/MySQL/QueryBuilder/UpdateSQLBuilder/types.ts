import type {
    EntityProperties
} from "../types"

export type UpdateAttributes<Entity extends object> = (
    Partial<EntityProperties<Entity>>
)

export type UpdateAttibutesKey<Entity extends object> = (
    keyof UpdateAttributes<Entity>
)

export type AttributesNames<Entity extends object> = Set<
    UpdateAttibutesKey<Entity>
>