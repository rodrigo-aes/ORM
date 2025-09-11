import type { EntityTarget } from "../../types/General"
import type { ForeignIdConfig } from "../../Metadata"

export type ForeignIdRelatedGetter = () => EntityTarget
export type ForeignIdOptions = Omit<ForeignIdConfig, 'referenced'>