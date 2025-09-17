import OneRelation from ".."

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    HasOneMetadata,
    PolymorphicHasOneMetadata
} from "../../../Metadata"

import type {
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../../SQLBuilders"

/**
 * Has one relation handler
 */
export default abstract class HasOneRelation<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    /** @internal */
    constructor(
        protected metadata: HasOneMetadata | PolymorphicHasOneMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a related entity in database
     * @param attributes - Related creation attributes data
     * @returns - Instance of created related entity
     */
    public create(attributes: CreationAttributes<InstanceType<Related>>): (
        Promise<InstanceType<Related>>
    ) {
        return this.queryExecutionHandler.executeCreate(
            this.sqlBuilder.createSQL(attributes),
            attributes
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a related entity in database
     * @param attributes - Related update or create attributes data
     * @returns - Instance of updated or created related entity
     */
    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<Related>>
    ): Promise<InstanceType<Related>> {
        return this.queryExecutionHandler.executeUpdateOrCreate(
            this.sqlBuilder.updateOrCreateSQL(attributes)
        )
    }
}