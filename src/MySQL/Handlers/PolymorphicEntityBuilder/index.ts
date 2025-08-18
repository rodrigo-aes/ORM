import BasePolymorphicEntity, {
    InternalPolymorphicEntities
} from "../../BasePolymorphicEntity"

import { MetadataHandler } from "../../Metadata"

import type { PolymorphicEntityMetadata, EntityMetadata } from "../../Metadata"
import type { PolymorphicEntityTarget, EntityTarget } from "../../../types/General"

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
        const meta = MetadataHandler.loadMetadata(source)
        const primary = meta.columns.primary.name

        return new source({
            ...(Object.fromEntries(Object.entries(target).flatMap(
                ([key, value]) => meta.columns.findColumn(key)
                    ? [[key, value]]
                    : []
            ))),
            [primary]: target.primaryKey
        }) as InstanceType<Source>
    }

    // ------------------------------------------------------------------------

    public static buildInternalEntityUnion(
        metadata: PolymorphicEntityMetadata
    ): PolymorphicEntityTarget {
        if (!this.entityNameRegExp.test(metadata.targetName)) throw new Error

        const entity = new Function(
            'PolymorphicEntity',
            `
                return class ${metadata.targetName} extends PolymorphicEntity {
                    constructor () {
                        super()
                        ${this.fillDinamicColumns(metadata)}
                    }
                }
            `
        )(BasePolymorphicEntity)

        InternalPolymorphicEntities.set(entity.name, entity)
        return entity
    }

    // Privates ---------------------------------------------------------------
    private static fillDinamicColumns(metadata: PolymorphicEntityMetadata): (
        string
    ) {
        return [...metadata.columns].map(
            col => `this[${JSON.stringify(col.name)}] = null`
        )
            .join('\n')
    }
}