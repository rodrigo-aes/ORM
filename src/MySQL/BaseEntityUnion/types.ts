import type EntityUnion from "."
import type { EntityTarget } from "../../types/General"
import type { UnionEntitiesMap } from "../Metadata"
import type BaseEntity from "../BaseEntity"

export type UnionTarget = new (...args: any[]) => EntityUnion<any[]>

interface NamedEntity {
    name: keyof UnionEntitiesMap
}

export type SourceEntity<T extends EntityTarget[]> = T[number] extends infer U
    ? U extends EntityTarget
    ? InstanceType<U>
    : never
    : never

export type EntityName<T extends EntityTarget[]> = (
    T[number] extends infer U
    ? U extends NamedEntity
    ? U['name']
    : never
    : never
)