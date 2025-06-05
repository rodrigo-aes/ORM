import { EntityMetadata } from "../../Metadata"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    CreationAttributes,
    EntityCreationAttributes
} from "../../QueryBuilder"

export default class EntityBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    constructor(
        public target: T,
        public attibutes: CreationAttributes<InstanceType<T>>
    ) {
        this.metadata = this.loadMetadata()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public build(): InstanceType<T> | InstanceType<T>[] {
        return Array.isArray(this.attibutes)
            ? this.buildManyEntities()
            : this.buildEntity()
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private buildEntity(
        attributes?: EntityCreationAttributes<InstanceType<T>>
    ): InstanceType<T> {
        const entity = new this.target().fill(
            (attributes ?? this.attibutes) as any
        )
        return entity as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    private buildManyEntities(): InstanceType<T>[] {
        return (this.attibutes as EntityCreationAttributes<InstanceType<T>>[])
            .map(att => this.buildEntity(att))
    }
}