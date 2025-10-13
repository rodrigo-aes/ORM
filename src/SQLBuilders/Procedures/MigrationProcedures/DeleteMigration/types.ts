import type { ProcedureArgs } from "../../types"

export type In = ProcedureArgs<
    ['unique_identifier'],
    [string | number]
>

export type Out = ProcedureArgs<
    ['deleted_order'],
    [number]
>