import type { PolymorphicEntityTarget, Target } from "../../../types/General"
import type {
    RelationMetadata,
    RelationsMetadataJSON
} from "../../EntityMetadata"

// Exceptions
import PolyORMException from "../../../Errors"

export default class PolymorphicRelationsMetadata extends Array<
    RelationMetadata
> {
    constructor(
        public target: PolymorphicEntityTarget | null,
        ...relations: RelationMetadata[]
    ) {
        super()
        this.mergeRelations(relations)
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species](): typeof Array {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public search(name: string): RelationMetadata | undefined {
        return this.find(rel => rel.name === name)
    }

    // ------------------------------------------------------------------------

    public searchByRelated(related: Target): (
        RelationMetadata | undefined
    ) {
        return this.find(({ relatedTarget }) => relatedTarget === related)
    }

    // ------------------------------------------------------------------------=

    public findOrThrow(name: string): RelationMetadata {
        return this.search(name)! ?? PolyORMException.Metadata.throw(
            "UNKNOWN_RELATION", name, this.target?.name ?? ''
        )
    }

    // ------------------------------------------------------------------------

    public findByRelatedOrthrow(related: Target): RelationMetadata {
        return this.searchByRelated(related)! ?? (
            PolyORMException.Metadata.throw(
                'UNKNOWN_RELATION',
                `${related.name} entity class`,
                this.target?.name ?? ''
            )
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): RelationsMetadataJSON {
        return this.map(rel => rel.toJSON())
    }

    // Privates ---------------------------------------------------------------
    private mergeRelations(relations: RelationMetadata[]): void {
        for (const { name } of relations) {
            const toMerge = relations.filter(rel => rel.name === name)

            if (toMerge.length > 1) this.verifyCompatibility(toMerge)

            this.push(toMerge[0])
        }
    }

    // ------------------------------------------------------------------------

    private verifyCompatibility(relations: RelationMetadata[]): void {
        const [{ type, relatedTarget, name }] = relations

        if (
            !relations.every(rel =>
                rel.type === type &&
                rel.relatedTarget === relatedTarget
            )
        ) PolyORMException.Metadata.throw(
            'IMCOMPATIBLE_POLYMORPHIC_RELATIONS',
            relations.map(({ type }) => type),
            name,
            this.target!.name
        )
    }
}