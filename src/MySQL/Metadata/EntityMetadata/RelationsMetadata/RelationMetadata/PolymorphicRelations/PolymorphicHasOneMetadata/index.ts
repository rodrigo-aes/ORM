import HasOneMetadata from "../../HasOneMetadata"

// Types
import type { EntityTarget } from "../../../../../../../types/General"
import type { PolymorphicChildOptions } from "../types"

export default class PolymorphicHasOneMetdata extends HasOneMetadata {
    public typeKey: string

    constructor(
        target: EntityTarget,
        { typeKey, ...options }: PolymorphicChildOptions
    ) {
        super(target, options)
        this.typeKey = typeKey
    }

    // Getters ================================================================
    // Publics -------------------------- --------------------------------------
    public get entityType(): string {
        return this.entity.target.name
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getScope(): any {
        return {
            ...(this.scope ?? {}),
            [this.typeKey]: this.entityType
        }
    }
}