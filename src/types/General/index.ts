import type BaseEntity from "../../MySQL/BaseEntity"
import type EntityUnion from "../../MySQL/EntityUnion"

export type EntityTarget = new (...args: any[]) => BaseEntity
export type UnionEntityTarget = new (...args: any[]) => EntityUnion