import type BaseEntity from "../../MySQL/BaseEntity"
import type BaseEntityUnion from "../../MySQL/BaseEntityUnion"

export type EntityTarget = new () => BaseEntity
export type UnionEntityTarget = new (...args: any[]) => BaseEntityUnion<any>

export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type AsUnionEntityTarget<T> = Extract<T, UnionEntityTarget>