import type { EntityTableBuilder, JoinTableBuilder } from "./TableBuilder"

export type SyncronizerConfig = {
    logging?: boolean
}

export type SyncronizerTable = EntityTableBuilder | JoinTableBuilder
export type SyncronizerTables = SyncronizerTable[]