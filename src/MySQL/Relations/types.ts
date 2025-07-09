import type {
    EntityTarget,
    UnionEntityTarget,
    AsEntityTarget,
    AsUnionEntityTarget
} from "../../types/General"

import type Repository from "../Repository"
import type UnionRepository from '../UnionRepository'

export type TypedRepository<T extends EntityTarget | UnionEntityTarget> = (
    T extends EntityTarget
    ? Repository<T>
    : T extends UnionEntityTarget
    ? UnionRepository<T>
    : never
)