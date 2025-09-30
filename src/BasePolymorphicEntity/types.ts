import type EntityUnion from "."
import type { EntityTarget, Constructor } from "../types"

export type UnionTarget = new (...args: any[]) => EntityUnion<any[]>

export type SourceEntity<T extends object[]> =
    Constructor<T[number]> extends infer U
    ? U extends EntityTarget
    ? InstanceType<U>
    : never
    : never
