import type { ProcedureArgs } from "../types"

export type In = ProcedureArgs<
    ['insertSQL', 'selectSQL'],
    [string, string]
>
