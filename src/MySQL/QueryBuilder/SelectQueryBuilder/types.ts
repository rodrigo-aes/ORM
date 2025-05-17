import type { EntityPropertiesKeys } from "../types"

type SelectPropertyKey<Entity extends object> = (
    '*' |
    EntityPropertiesKeys<Entity>
)

export type SelectOptions<Entity extends object> = {
    properties?: SelectPropertyKey<Entity>[],
    count?: { [key: string]: any }
}