import type {
    OptionalNullable,
    EntityProperties
} from "../../types"

export type UpdateOrCreateAttibutes<Entity extends object> = (
    OptionalNullable<EntityProperties<Entity>>
)