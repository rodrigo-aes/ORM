import type BaseEntity from "../../MySQL/BaseEntity"
import type BaseEntityUnion from "../../MySQL/BaseEntityUnion"

export type EntityTarget = new () => BaseEntity
export type EntityUnionTarget = new (...args: any[]) => BaseEntityUnion<any>

export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type AsEntityUnionTarget<T> = Extract<T, EntityUnionTarget>