import ManyRelation from ".."

// Types
import type { EntityTarget } from "../../../../types/General"
import type {
    HasManyMetadata,
    PolymorphicHasManyMetadata,
    BelongsToManyMetadata
} from "../../../Metadata"

import type {
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../../SQLBuilders"

export default abstract class HasManyRelation<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelation<Target, Related> {
    constructor(
        protected metadata: (
            HasManyMetadata |
            PolymorphicHasManyMetadata |
            BelongsToManyMetadata
        ),
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

    public createMany(
        attributes: CreationAttributes<InstanceType<Related>>[]
    ): Promise<InstanceType<Related>[]> {
        return this.queryExecutionHandler.executeCreateMany(
            this.sqlBuilder.createManySQL(attributes),
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