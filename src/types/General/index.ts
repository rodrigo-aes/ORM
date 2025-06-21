import type BaseEntity from "../../MySQL/BaseEntity"
import type UnionEntity from "../../MySQL/UnionEntity"

export type EntityTarget = new (...args: any[]) => BaseEntity
export type UnionEntityTarget = new (...args: any[]) => UnionEntity