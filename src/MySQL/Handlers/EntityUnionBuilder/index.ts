import { PolymorphicEntityMetadata } from "../../Metadata"
import EntityUnion, { InternalUnionEntities } from "../../BasePolymorphicEntity"
import type { EntityUnionTarget } from "../../../types/General"

export default class EntityUnionBuilder {
    public static readonly entityNameRegExp = /^[A-Z][A-Za-z0-9]*$/

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildInternalEntityUnion(
        metadata: PolymorphicEntityMetadata
    ): EntityUnionTarget {
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
        )(EntityUnion)

        InternalUnionEntities.set(entity.name, entity)
        return entity
    }

    // Privates ---------------------------------------------------------------
    private static fillDinamicColumns(metadata: PolymorphicEntityMetadata): string {
        return [...metadata.columns].map(
            col => `this[${JSON.stringify(col.name)}] = null`
        )
            .join('\n')
    }
}