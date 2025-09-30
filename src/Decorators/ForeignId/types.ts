import type { EntityTarget } from "../../types"
import type { ForeignIdConfig } from "../../Metadata"

export type ForeignIdRelatedGetter = () => EntityTarget
export type ForeignIdOptions = Omit<ForeignIdConfig, 'referenced'>