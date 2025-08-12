import type { RelationMetadata } from "../../EntityMetadata"
import type { EntityUnionTarget } from "../../../../types/General"
import type { RelationsMetadataJSON } from "../../EntityMetadata"

export default class UnionRelationsMetadata extends Array<RelationMetadata> {
    constructor(
        public target: EntityUnionTarget | null,
        ...relations: RelationMetadata[]
    ) {
        super()
        this.mergeRelations(relations)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): RelationsMetadataJSON {
        return [...this].map(rel => rel.toJSON())
    }

    // Privates ---------------------------------------------------------------
    private mergeRelations(relations: RelationMetadata[]): void {
        for (const { name } of relations) {
            const toMerge = [...relations].filter(rel => rel.name === name)

            if (toMerge.length > 1) this.verifyCompatibility(toMerge)

            this.push(toMerge[0])
        }
    }

    // ------------------------------------------------------------------------

    private verifyCompatibility(relations: RelationMetadata[]): void {
        const [{ type, relatedTarget }] = relations
        const compatible = relations.every(rel => (
            rel.type === type &&
            rel.relatedTarget === relatedTarget
        ))

        if (!compatible) throw new Error
    }
}