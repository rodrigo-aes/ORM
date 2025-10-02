import MetadataArray from '../../MetadataArray'
import EntityMetadata, { DataType } from '../../EntityMetadata'
import PolymorphicColumnMetadata, {
    type PolymorphicColumnMetadataJSON
} from './PolymorphicColumnMetadata'

// Types
import type { PolymorphicEntityTarget } from '../../../types'

import type {
    PolymorphicColumnsMetadataJSON,
    IncludedColumns,
    IncludeColumnOptions
} from './types'

// Exceptions
import PolyORMException, { type MetadataErrorCode } from '../../../Errors'

export default class PolymorphicColumnsMetadata extends MetadataArray<
    PolymorphicColumnMetadata
> {
    protected static override readonly KEY: string = (
        'polymorphic-columns-metadata'
    )
    protected static readonly UNCLUDED_KEY: string = (
        'included-polymorphic-columns'
    )

    protected readonly KEY: string = PolymorphicColumnsMetadata.KEY
    protected readonly SEARCH_KEYS: (keyof PolymorphicColumnMetadata)[] = [
        'name'
    ]
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_COLUMN'
    )

    constructor(
        public target: PolymorphicEntityTarget,
        private sources: EntityMetadata[]
    ) {
        super()

        this.mergePrimaryKeys()
        this.buildTypeColumn()
        this.mergeIncluded()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): PolymorphicColumnMetadata {
        return this.find(({ primary }) => primary)! ?? PolyORMException
            .Metadata
            .throw('MISSING_PRIMARY_KEY', this.target.name)
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): (PolymorphicColumnMetadata)[] {
        return this.filter(({ isForeignKey }) => isForeignKey)
    }

    // Privates ---------------------------------------------------------------
    private get included(): IncludedColumns {
        return PolymorphicColumnsMetadata.included(this.target)
    }

    // Privates ---------------------------------------------------------------
    private mergePrimaryKeys(): void {
        this.push(new PolymorphicColumnMetadata(
            this.target,
            'primaryKey',
            this.sources.map(meta => meta.columns.primary)
        ))
    }

    // ------------------------------------------------------------------------

    private buildTypeColumn(): void {
        this.push(new PolymorphicColumnMetadata(
            this.target,
            'entityType',
            undefined,
            DataType.ENUM(...Array.from(
                new Set<string>(this.sources.map(({ target }) => target.name))
            )))
        )
    }

    // ------------------------------------------------------------------------

    private mergeIncluded(): void {
        this.push(...Object.entries(this.included).map(
            ([name, options]) => new PolymorphicColumnMetadata(
                this.target,
                name,
                options.map(({ target, column }) => (
                    EntityMetadata.findOrThrow(target).columns.findOrThrow(
                        column
                    )
                ))
            )
        ))
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static included(target: PolymorphicEntityTarget): IncludedColumns {
        return Reflect.getOwnMetadata(this.UNCLUDED_KEY, target) ?? {}
    }

    // ------------------------------------------------------------------------

    public static include(
        target: PolymorphicEntityTarget,
        name: string,
        options: IncludeColumnOptions
    ): void {
        Reflect.defineMetadata(
            this.UNCLUDED_KEY,
            { ...this.included(target), [name]: options },
            target
        )
    }
}

export {
    PolymorphicColumnMetadata,

    type PolymorphicColumnsMetadataJSON,
    type PolymorphicColumnMetadataJSON,
    type IncludedColumns,
    type IncludeColumnOptions
}