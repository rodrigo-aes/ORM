import MetadataArray from '../../MetadataArray'
import EntityMetadata from '../../EntityMetadata'
import PolymorphicColumnMetadata from './PolymorphicColumnMetadata'

// Types
import type { PolymorphicEntityTarget } from '../../../types'
import type { ColumnMetadata, ColumnsMetadataJSON } from '../../EntityMetadata'
import type {
    CombinedColumns,
    CombinedColumnOptions,
    MergeSourceColumnsConfig
} from './types'

// Exceptions
import PolyORMException, { type MetadataErrorCode } from '../../../Errors'

export default class PolymorphicColumnsMetadata extends MetadataArray<
    PolymorphicColumnMetadata
> {
    protected static override readonly KEY: string = (
        'polymorphic-columns-metadata'
    )

    protected readonly KEY: string = PolymorphicColumnsMetadata.KEY
    protected readonly SEARCH_KEYS: (keyof PolymorphicColumnMetadata)[] = [
        'name'
    ]
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_RELATION'
    )

    constructor(
        public target: PolymorphicEntityTarget,
        public sources: ColumnMetadata[]
    ) {
        super()

        this.mergePrimaryKeys()
        this.buildEntityTypeColumn()
        this.mergeSources()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): PolymorphicColumnMetadata {
        return this.find(({ primary }) => primary)!
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): PolymorphicColumnMetadata[] {
        return this.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): PolymorphicColumnMetadata[] {
        return this.foreignKeys.filter(
            ({ references }) => references?.constrained
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public combine(config: CombinedColumns): void {
        for (const [name, options] of Object.entries(config)) (
            this.mergeColumns(this.extractCombinedColumns(options), {
                internalName: name,
                shouldVerifyDataType: false
            })
        )
    }

    // Privates ---------------------------------------------------------------
    private mergePrimaryKeys(): void {
        this.push(this.mergeColumns(
            this.sources.filter(({ primary }) => primary),
            {
                internalName: 'primaryKey',
                shouldVerifyDataType: false
            }
        ))
    }

    // ------------------------------------------------------------------------

    private buildEntityTypeColumn(): void {
        const entityTypes = Array.from(
            new Set(this.sources.map(({ target }) => target))
        )

        this.push(PolymorphicColumnMetadata.buildEntityTypeColumn(
            this.target,
            ...entityTypes
        ))
    }

    // ------------------------------------------------------------------------

    private mergeSources(): void {
        const mapped = new Set<string>()

        for (const { name, primary } of this.sources) {
            if (mapped.has(name) || primary) continue

            this.push(this.mergeColumns(
                this.sources.filter(source => source.name === name)
            ))

            mapped.add(name)
        }
    }

    // ------------------------------------------------------------------------

    private mergeColumns(
        columns: ColumnMetadata[],
        {
            internalName,
            shouldVerifyDataType = true,
            shouldAssignCommonProperties = true
        }: MergeSourceColumnsConfig = {}
    ): PolymorphicColumnMetadata {
        const shouldMerge = columns.length > 1

        if (shouldVerifyDataType && shouldMerge) this.verifyDataType(columns)

        const [{ name, dataType }] = columns

        const unionColumn = new PolymorphicColumnMetadata(
            this.target,
            internalName ?? name,
            dataType,
            columns
        )

        if (shouldAssignCommonProperties) {
            if (shouldMerge) this.assignCommonProperties(unionColumn, columns)
            else Object.assign(unionColumn, columns[0])
        }


        return unionColumn
    }

    // ------------------------------------------------------------------------

    private extractCombinedColumns(options: CombinedColumnOptions): (
        ColumnMetadata[]
    ) {
        return options.map(({ target, column }) =>
            EntityMetadata.findOrThrow(target).columns.findOrThrow(column)
        )
    }

    // ------------------------------------------------------------------------

    private verifyDataType(columns: ColumnMetadata[]): void {
        const [{ dataType: { type }, name }] = columns

        if (!columns.every(({ dataType }) => dataType.type === type)) throw (
            PolyORMException.Metadata.instantiate(
                'IMCOMPATIBLE_POLYMORPHIC_COLUMN_DATATYPES',
                columns.map(({ dataType }) => dataType.constructor.name),
                this.target!.name,
                name
            )
        )
    }

    // ------------------------------------------------------------------------

    private assignCommonProperties(
        unionColumn: PolymorphicColumnMetadata,
        columns: ColumnMetadata[]
    ): void {
        const [first] = columns
        const keys: (keyof ColumnMetadata)[] = [
            'length',
            'nullable',
            'defaultValue',
            'unique',
            'primary',
            'autoIncrement',
            'unsigned',
            'isForeignKey',
            'references'
        ]

        Object.assign(unionColumn, Object.fromEntries(
            keys.flatMap(key =>
                columns.every(column => column[key] === first[key])
                    ? [[key, first[key]]]
                    : []
            )
        ))
    }
}

export {
    PolymorphicColumnMetadata,

    type CombinedColumns,
    type CombinedColumnOptions
}