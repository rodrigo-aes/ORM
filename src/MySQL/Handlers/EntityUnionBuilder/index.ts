import { EntityUnionMetadata } from "../../Metadata"
import EntityUnion, { InternalUnionEntities } from "../../BaseEntityUnion"
import type { UnionEntityTarget } from "../../../types/General"

export default class EntityUnionBuilder {
    public static readonly entityNameRegExp = /^[A-Z][A-Za-z0-9]*$/

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildInternalEntityUnion(
        metadata: EntityUnionMetadata
    ): UnionEntityTarget {
        if (!this.entityNameRegExp.test(metadata.targetName)) throw new Error

        const entity = new Function(
            'UnionEntity',
            `
                return class ${metadata.targetName} extends UnionEntity {
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
    private static fillDinamicColumns(metadata: EntityUnionMetadata): string {
        return [...metadata.columns].map(
            col => `this[${JSON.stringify(col.name)}] = null`
        )
            .join('\n')
    }
}