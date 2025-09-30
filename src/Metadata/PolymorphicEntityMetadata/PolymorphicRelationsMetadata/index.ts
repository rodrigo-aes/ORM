import MetadataArray from "../../MetadataArray"

import type { PolymorphicEntityTarget, Target } from "../../../types"
import type {
    RelationMetadata,
    RelationsMetadataJSON
} from "../../EntityMetadata"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../../../Errors"

export default class PolymorphicRelationsMetadata extends MetadataArray<
    RelationMetadata
> {
    protected static override readonly KEY: string = 'relations-metadata'
    protected readonly KEY: string = PolymorphicRelationsMetadata.KEY

    protected readonly SEARCH_KEYS: (keyof RelationMetadata)[] = [
        'name', 'relatedTarget'
    ]
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_RELATION'
    )

    constructor(
        public target: PolymorphicEntityTarget,
        ...relations: RelationMetadata[]
    ) {
        super(target, ...relations)
        this.mergeRelations(relations)
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private mergeRelations(relations: RelationMetadata[]): void {
        const keys = Object.keys(this.target)

        this.push(
            ...relations.flatMap(({ name }) => {
                const rels = relations.filter(rel => (
                    keys.includes(name) &&
                    rel.name === name
                ))

                if (rels.length > 1) {
                    this.verifyCompatibility(rels)
                    return rels[0]
                }

                return rels
            })
        )
    }

    // ------------------------------------------------------------------------

    private verifyCompatibility(relations: RelationMetadata[]): void {
        const [{ type, relatedTarget, name }] = relations

        if (!relations.every(rel =>
            rel.type === type &&
            rel.relatedTarget === relatedTarget
        )) PolyORMException.Metadata.throw(
            'IMCOMPATIBLE_POLYMORPHIC_RELATIONS',
            relations.map(({ type }) => type),
            name,
            this.target!.name
        )
    }
}