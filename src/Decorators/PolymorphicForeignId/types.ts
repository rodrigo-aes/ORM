import type { EntityTarget } from "../../types/General"
import type { PolymorphicForeignIdConfig } from "../../Metadata"

export type PolymorphicForeignIdRelatedGetter = () => (
    EntityTarget | EntityTarget[]
)

export type PolymorphicForeignIdOptions = Omit<
    PolymorphicForeignIdConfig,
    'referenced'
>