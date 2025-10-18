import BasePolymorphicEntity, {
    InternalPolymorphicEntities
} from "../../BasePolymorphicEntity"

import { MetadataHandler } from "../../Metadata"

import type { PolymorphicEntityMetadata } from "../../Metadata"
import type { PolymorphicEntityTarget, EntityTarget } from "../../types"

export default class PolymorphicEntityBuilder {
    public static readonly entityNameRegExp = /^[A-Z][A-Za-z0-9]*$/

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static instantiateSourceEntity<
        Source extends EntityTarget,
        T extends BasePolymorphicEntity<any>
    >(
        source: Source,
        target: T
    ): InstanceType<Source> {
        const pk = MetadataHandler.targetMetadata(source).columns.primary.name
        const meta = MetadataHandler.targetMetadata(target.constructor as (
            PolymorphicEntityTarget
        ))

        return new source({
            [pk]: target.primaryKey,

            ...Object.fromEntries(meta.columns.sourceColumns(source).map(
                ([sourceCol, targetCol]) => [sourceCol, target[targetCol as (
                    keyof T
                )]]
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