import 'reflect-metadata'

import MetadataArray from '../../MetadataArray'

import ColumnMetadata, {
    type SQLColumnType,
    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
} from "./ColumnMetadata"

import type DataType from "../DataType"
import type { EntityTarget } from "../../../types"
import type { ColumnsMetadataJSON } from './types'

// Exceptions
import PolyORMException, { type MetadataErrorCode } from '../../../Errors'
export default class ColumnsMetadata extends MetadataArray<ColumnMetadata> {
    protected static override readonly KEY: string = 'columns-metadata'

    protected readonly KEY: string = ColumnsMetadata.KEY
    protected readonly SEARCH_KEYS: (keyof ColumnMetadata)[] = ['name']
    protected readonly UNIQUE_MERGE_KEYS: (keyof ColumnMetadata)[] = (
        this.SEARCH_KEYS
    )
    protected readonly UNKNOWN_ERROR_CODE?: MetadataErrorCode = (
        'UNKNOWN_COLUMN'
    )

    declare public target: EntityTarget

    private _primary?: ColumnMetadata
    private _foreignKeys?: ColumnMetadata[]
    private _constrainedForeignKeys?: ColumnMetadata[]

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): ColumnMetadata {
        return this._primary = this._primary
            ?? this.find(({ primary }) => primary)!
            ?? PolyORMException.Metadata.throw(
                'MISSING_PRIMARY_KEY', this.target.name
            )
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): ColumnMetadata[] {
        return this._foreignKeys = this._foreignKeys
            ?? this.filter(({ isForeignKey }) => isForeignKey)
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): ColumnMetadata[] {
        return this._constrainedForeignKeys = this._constrainedForeignKeys
            ?? this.foreignKeys.filter(({ references }) =>
                references?.constrained
            )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public registerColumn(name: string, dataType: DataType) {
        const column = new ColumnMetadata(this.target, name, dataType)
        this.push(column)

        return column
    }

    // ------------------------------------------------------------------------

    public registerColumnPattern(
        name: string,
        pattern: ColumnPattern,
        ...rest: any[]
    ) {
        const column = ColumnMetadata.buildPattern(
            this.target, name, pattern, ...rest
        )
        this.push(column)

        return column
    }

    // ------------------------------------------------------------------------

    public defineForeignKey(
        name: string,
        initMap: ForeignKeyReferencesInitMap
    ) {
        this.findOrThrow(name).defineForeignKey(initMap)
    }
}

export {
    ColumnMetadata,

    type SQLColumnType,
    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
}