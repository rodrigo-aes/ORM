import type { EntityProperties } from "../types"
import type { OptionalNullable } from "../../../types/Properties"

export type UpdateOrCreateAttibutes<Entity extends object> = (
    Partial<OptionalNullable<EntityProperties<Entity>>>
)