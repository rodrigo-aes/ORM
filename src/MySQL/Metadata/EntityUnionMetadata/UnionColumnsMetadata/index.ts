import 'reflect-metadata'

import UnionColumnMetadata from './UnionColumnMetadata'

// Types
import type { UnionEntityTarget } from '../../../../types/General'
import type { ColumnMetadata, ColumnsMetadataJSON } from '../../EntityMetadata'

export default class UnionColumnsMetadata extends Array<UnionColumnMetadata> {
    constructor(
        public target: UnionEntityTarget | null,
        public sources: ColumnMetadata[]
    ) {
        super()

        this.mergePrimaryKeys()
        this.buildEntityTypeColumn()
        this.mergeSources()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): UnionColumnMetadata {
        return this.find(({ primary }) => primary)!
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): UnionColumnMetadata[] {
        return this.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): UnionColumnMetadata[] {
        return this.foreignKeys.filter(
            ({ references }) => references?.constrained
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): ColumnsMetadataJSON {
        return [...this].map(column => column.toJSON())
    }

    // ------------------------------------------------------------------------

    public findColumn(name: string): UnionColumnMetadata | undefined {
        return this.find((col) => col.name === name)
    }

    // Privates ---------------------------------------------------------------
    private mergePrimaryKeys(): void {
        this.push(
            this.mergeColumns(
                this.sources.filter(({ primary }) => primary),
                'primaryKey'
            )
        )
    }

    // ------------------------------------------------------------------------

    private buildEntityTypeColumn(): void {
        const entityTypes = new Set(this.sources.map(({ target }) => target))
        this.push(UnionColumnMetadata.buildEntityTypeColumn(
            this.target,
            ...entityTypes
        ))
    }

    // ------------------------------------------------------------------------

    private mergeSources(): void {
        const mapped = new Set<string>()

        for (const source of this.sources) {
            if (source.primary) continue
            if (mapped.has(source.name)) continue

            const toMerge = this.sources.filter(
                ({ name }) => name === source.name
            )

            this.push(this.mergeColumns(toMerge))

            mapped.add(source.name)
        }
    }

    // ------------------------------------------------------------------------

    private mergeColumns(columns: ColumnMetadata[], internalName?: string): (
        UnionColumnMetadata
    ) {
        const shouldMerge = columns.length > 1

        if (shouldMerge) this.verifyDataType(columns)

        const [{ name, dataType }] = columns

        const unionColumn = new UnionColumnMetadata(
            this.target,
            internalName ?? name,
            dataType
        )

        if (shouldMerge) this.assignCommonProperties(unionColumn, columns)
        else Object.assign(unionColumn, columns[0])

        return unionColumn
    }

    // ------------------------------------------------------------------------

    private verifyDataType(columns: ColumnMetadata[]): void {
        const [{ dataType: { type } }] = columns

        if (!columns.every(({ dataType }) => dataType.type === type)) {
            throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private assignCommonProperties(
        unionColumn: UnionColumnMetadata,
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
    UnionColumnMetadata
}