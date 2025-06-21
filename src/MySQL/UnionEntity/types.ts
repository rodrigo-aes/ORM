import type UnionEntity from "."
import type { EntityTarget } from "../../types/General"

export type UnionTarget = new (...args: any[]) => UnionEntity<any[]>

export type UnionEntityMap = {
    [K: string]: EntityTarget
}

interface NamedEntity {
    name: keyof UnionEntityMap
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