import { ComputedPropertiesMetadata } from "../../../Metadata"

// Types
import type { CollectionTarget } from "../../../../types/General"
import type BaseEntity from "../.."
import type BasePolymorphicEntity from "../../../BasePolymorphicEntity"

export default class Collection<
    Entity extends BaseEntity | BasePolymorphicEntity<any>
> extends Array<Entity> {
    public static alias: string = this.name

    constructor(...entities: Entity[]) {
        super(...entities)

        this.assignComputedProperties()
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private assignComputedProperties(): void {
        ComputedPropertiesMetadata.find(this.constructor as CollectionTarget)
            ?.assign(this)
    }
}