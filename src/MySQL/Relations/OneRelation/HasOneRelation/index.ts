import OneRelation from ".."

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    HasOneMetadata,
    PolymorphicHasOneMetadata
} from "../../../Metadata"

import type {
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../../QueryBuilder"

export default abstract class HasOneRelation<
    Target extends object,
    Related extends EntityTarget
> extends OneRelation<Target, Related> {
    constructor(
        protected metadata: HasOneMetadata | PolymorphicHasOneMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(attributes: CreationAttributes<InstanceType<Related>>): (
        Promise<InstanceType<Related>>
    ) {
        return this.queryExecutionHandler.executeCreate(
            this.sqlBuilder.createSQL(attributes),
            attributes
        )
    }

    // ------------------------------------------------------------------------

    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<Related>>
    ): Promise<InstanceType<Related>> {
        return this.queryExecutionHandler.executeUpdateOrCreate(
            this.sqlBuilder.updateOrCreateSQL(attributes)
        )
    }
}