import type UnionEntity from "."
import type { EntityTarget } from "../../types/General"
import type { UnionEntitiesMap } from "../Metadata"

export type UnionTarget = new (...args: any[]) => UnionEntity<any[]>

interface NamedEntity {
    name: keyof UnionEntitiesMap
}

export type SourceEntity<T extends EntityTarget[]> = T[number] extends infer U
    ? U extends EntityTarget
    ? U
    : never
    : never;

export type EntityName<T extends EntityTarget[]> = T[number] extends infer U
    ? U extends NamedEntity
    ? U['name']
    : never
    : never;