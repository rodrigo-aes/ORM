import type BaseEntity from "../BaseEntity"

export type EntityPropertiesKeys<Entity extends object> = {
    [K in keyof Entity]: Entity[K] extends Function ? never : K
}[keyof Entity]

export type EntityRelationsKeys<Entity extends object> = {
    [K in keyof Entity]: Entity[K] extends BaseEntity
    ? K
    : never
}[keyof Entity]

export type EntityProperties<Entity extends object> = Pick<
    Entity,
    EntityPropertiesKeys<Entity>
>

export type EntityRelations<Entity extends object> = Pick<
    Entity,
    EntityRelationsKeys<Entity>
>