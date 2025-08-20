import type BaseEntity from "../BaseEntity"
import type BasePolymorphicEntity from "../BasePolymorphicEntity"
export type EntityPropertiesKeys<Entity extends object> = {
    [K in keyof Entity]: (
        Entity[K] extends (
            BaseEntity |
            BasePolymorphicEntity<any> |
            null |
            Function
        )
        ? never
        : K
    )
}[keyof Entity]

export type EntityRelationsKeys<Entity extends object> = {
    [K in keyof Entity]: (
        Entity[K] extends (
            BaseEntity |
            BasePolymorphicEntity<any> |
            null
        )
        ? K
        : never
    )
}[keyof Entity]

export type EntityProperties<Entity extends object> = Pick<
    Entity,
    EntityPropertiesKeys<Entity>
>

export type EntityRelations<Entity extends object> = Pick<
    Entity,
    EntityRelationsKeys<Entity>
>