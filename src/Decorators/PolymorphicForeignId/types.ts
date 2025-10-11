import type { EntityTarget, Target } from "../../types"
import type { PolymorphicForeignIdConfig } from "../../Metadata"

export type PolymorphicForeignIdRelatedGetter = () => (
    EntityTarget | EntityTarget[]
)

export type PolymorphicForeignIdOptions = Omit<
    PolymorphicForeignIdConfig,
    'referenced'
>