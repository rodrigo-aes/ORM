import type { ProcedureArgs } from "../../types"

export type In = ProcedureArgs<
    ['from_order', 'to_order'],
    [number, number]
>