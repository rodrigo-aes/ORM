import type BaseEntity from "../../MySQL/BaseEntity"
import type BaseEntityUnion from "../../MySQL/BaseEntityUnion"
import type { Collection } from "../../MySQL/BaseEntity"

export type EntityTarget = new (...args: any[]) => BaseEntity
export type EntityUnionTarget = new (...args: any[]) => BaseEntityUnion<any>
export type CollectionTarget = new (...args: any[]) => Collection<any>

export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type AsEntityUnionTarget<T> = Extract<T, EntityUnionTarget>

export type Constructor<T extends object> = new (...args: any[]) => T