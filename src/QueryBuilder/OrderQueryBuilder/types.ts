import type { Target } from "../../types"
import type { OrderQueryOption } from "../../SQLBuilders"
import type { CaseQueryHandler } from "../types"

export type OrderQueryOptions<
    T extends Target,
    Order extends (
        OrderQueryOption<InstanceType<T>> |
        CaseQueryHandler<T>
    )
> = [
        Order,
        ...Order extends OrderQueryOption<InstanceType<T>>
        ? OrderQueryOption<InstanceType<T>>[]
        : never[]
    ]