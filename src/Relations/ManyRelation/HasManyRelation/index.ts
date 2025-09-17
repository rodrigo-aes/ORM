import ManyRelation from ".."

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    HasManyMetadata,
    PolymorphicHasManyMetadata,
    BelongsToManyMetadata
} from "../../../Metadata"

import type {
    CreationAttributes,
    UpdateOrCreateAttibutes
} from "../../../SQLBuilders"

/** Has many relation handler */
export default abstract class HasManyRelation<
    Target extends object,
    Related extends EntityTarget
> extends ManyRelation<Target, Related> {
    /** @internal */
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
    /**
     * Create a related entity register and return instance
     * @param attributes - Related entity creation attributes
     * @returns - Related entity instance
     */
    public async create(
        attributes: CreationAttributes<InstanceType<Related>>
    ): Promise<InstanceType<Related>> {
        const entity = await this.queryExecutionHandler.executeCreate(
            this.sqlBuilder.createSQL(attributes),
            attributes
        )

        this.push(entity)

        return entity
    }

    // ------------------------------------------------------------------------

    /**
     * Create many related entity registers and return instances
     * @param attributes - An array of creation attributes data
     * @returns - Related entity instances
     */
    public async createMany(
        attributes: CreationAttributes<InstanceType<Related>>[]
    ): Promise<InstanceType<Related>[]> {
        const entities = await this.queryExecutionHandler.executeCreateMany(
            this.sqlBuilder.createManySQL(attributes),
            attributes
        )

        this.push(...entities)

        return entities
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a entity register
     * @param attributes - Update or create attributes data
     * @returns - Related entity instance
     */
    public async updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<Related>>
    ): Promise<InstanceType<Related>> {
        const entity = await this.queryExecutionHandler.executeUpdateOrCreate(
            this.sqlBuilder.updateOrCreateSQL(attributes)
        )

        this.mergeResult(entity)

        return entity
    }
}