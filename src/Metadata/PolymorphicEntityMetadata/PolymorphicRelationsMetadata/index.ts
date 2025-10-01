import MetadataArray from "../../MetadataArray"
import { EntityMetadata } from "../../.."

// Types
import type { PolymorphicEntityTarget } from "../../../types"
import type {
    RelationMetadata,
    RelationsMetadataJSON
} from "../../EntityMetadata"
import type { IncludedRelations, IncludeRelationOptions } from "./types"

// Exceptions
import PolyORMException, { type MetadataErrorCode } from "../../../Errors"


export default class PolymorphicRelationsMetadata extends MetadataArray<
    RelationMetadata
> {
    protected static override readonly KEY: string = 'relations-metadata'
    protected static readonly UNCLUDED_KEY: string = (
        'included-polymorphic-relations'
    )

    protected readonly KEY: string = PolymorphicRelationsMetadata.KEY
    protected readonly SEARCH_KEYS: (keyof RelationMetadata)[] = [
        'name', 'relatedTarget'
    ]
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_RELATION'
    )

    constructor(
        public target: PolymorphicEntityTarget,
        private sources: EntityMetadata[]
    ) {
        super(target)
        this.mergeRelations()
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get included(): IncludedRelations {
        return PolymorphicRelationsMetadata.included(this.target)
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private mergeRelations(): void {
        // this.push(...Object.entries(this.included).map(
        //     ([name, options])
        // ))
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

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static included(target: PolymorphicEntityTarget): (
        IncludedRelations
    ) {
        return Reflect.getOwnMetadata(this.UNCLUDED_KEY, target) ?? {}
    }

    // ------------------------------------------------------------------------

    public static include(
        target: PolymorphicEntityTarget,
        name: string,
        options: IncludeRelationOptions
    ): void {
        Reflect.defineMetadata(
            this.UNCLUDED_KEY,
            { ...this.included(target), [name]: options },
            target
        )
    }
}