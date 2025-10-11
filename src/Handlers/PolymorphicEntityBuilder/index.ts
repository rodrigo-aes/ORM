import BasePolymorphicEntity, {
    InternalPolymorphicEntities
} from "../../BasePolymorphicEntity"

import { MetadataHandler } from "../../Metadata"

import type { PolymorphicEntityMetadata, EntityMetadata } from "../../Metadata"
import type { PolymorphicEntityTarget, EntityTarget } from "../../types"

export default class PolymorphicEntityBuilder {
    public static readonly entityNameRegExp = /^[A-Z][A-Za-z0-9]*$/

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildSourceEntity<
        Source extends EntityTarget,
        T extends BasePolymorphicEntity<any>
    >(
        source: Source,
        target: T
    ): InstanceType<Source> {
        const meta = MetadataHandler.targetMetadata(source)

        return new source({
            [meta.columns.primary.name]: target.primaryKey,

            ...Object.fromEntries(Object.entries(target).flatMap(
                ([key, value]) => meta.columns.search(key)
                    ? [[key, value]]
                    : []
            )),

        }) as InstanceType<Source>
    }

    // ------------------------------------------------------------------------

    public static buildInternalPolymorphicEntity(
        metadata: PolymorphicEntityMetadata
    ): PolymorphicEntityTarget {
        if (!this.entityNameRegExp.test(metadata.name)) throw new Error

        const entity = new Function(
            'BasePolymorphicEntity',
            `
                return class ${metadata.name} 
                extends BasePolymorphicEntity {
                    constructor () {
                        super()
                    }
                }
            `
        )(BasePolymorphicEntity)

        InternalPolymorphicEntities.set(entity.name, entity)
        return entity
    }
}