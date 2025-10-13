export type SyncManyToManyArgs = [string, string]

import { ProcedureArgs } from "../types"

export type In = ProcedureArgs<
    ['insertSQL', 'deleteSQL'],
    [string, string]
>