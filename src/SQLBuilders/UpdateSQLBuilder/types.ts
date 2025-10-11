import type { EntityProperties } from "../../types"

export type UpdateAttributes<Entity extends object> = (
    Partial<EntityProperties<Entity>>
)

export type UpdateAttributesKeys<Entity extends object> = (
    (keyof UpdateAttributes<Entity>)[]
)