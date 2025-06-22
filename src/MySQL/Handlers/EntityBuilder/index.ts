import { EntityMetadata, EntityUnionMetadata } from "../../Metadata"

// Objects
import { Collection } from "../../BaseEntity"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"
import type {
    CreationAttributes,
    CreationAttributesOptions
} from "../../QueryBuilder"

export default class EntityBuilder<
    T extends EntityTarget | UnionEntityTarget
> {
    protected metadata: EntityMetadata | EntityUnionMetadata

    constructor(
        public target: T,
        public attibutes: CreationAttributesOptions<InstanceType<T>>,
        public primary?: number
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public build(): InstanceType<T> | Collection<InstanceType<T>> {
        return Array.isArray(this.attibutes)
            ? this.buildManyEntities()
            : this.buildEntity()
    }

    // Privates ---------------------------------------------------------------
    private buildEntity(
        attributes?: CreationAttributesOptions<InstanceType<T>>
    ): InstanceType<T> {
        const entity = new this.target().fill(
            (attributes ?? this.attibutes) as any
        ) as InstanceType<T>

        if (this.primary) this.fillPrimaryKey(entity)

        return entity
    }

    // ------------------------------------------------------------------------

    private buildManyEntities(): Collection<InstanceType<T>> {
        return new Collection(
            ...(this.attibutes as CreationAttributesOptions<InstanceType<T>>[])
                .map(att => this.buildEntity(att))
        )
    }

    // ------------------------------------------------------------------------

    private fillPrimaryKey(
        entity: InstanceType<T>
    ): void {
        const metadata = this.metadata.columns.primary
        const primaryName = this.metadata.columns.primary.name as (
            keyof InstanceType<T>
        )
        const shouldFill = (
            metadata.dataType.type === 'bigint' &&
            metadata.autoIncrement &&
            !entity[primaryName]
        )

        if (shouldFill) (entity[primaryName] as number) = this.primary!
    }
}