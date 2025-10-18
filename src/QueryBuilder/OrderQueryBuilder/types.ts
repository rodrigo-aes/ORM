import { Target } from "../../types"
import type { OrderQueryOption } from "../../SQLBuilders"
import type { CaseQueryHandler } from "../types"


export type OrderQueryOptions<T extends Target> = (
    OrderQueryOption<InstanceType<T>> |
    CaseQueryHandler<T>
)[]