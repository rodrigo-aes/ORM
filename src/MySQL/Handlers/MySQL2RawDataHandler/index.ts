import { EntityMetadata } from "../../Metadata"

// Metadata
import { RelationMetadata } from "../../Metadata"

// Base Entity
import { Collection, RelationCollection } from "../../BaseEntity"

// Types
import type { EntityTarget } from "../../../types/General"
import type {
    MySQL2RawData,
    MappedDataType,
    RawData,
    DataFillMethod
} from "./types"
import type { RelationMetadataType } from "../../Metadata"

export default class MySQL2RawDataHandler<T extends EntityTarget> {
    private metadata: EntityMetadata
    private mySQL2RawData!: MySQL2RawData[]
    private _raw?: RawData<T> | RawData<T>[]
    private _entity?: InstanceType<T> | Collection<InstanceType<T>>

    constructor(
        public target: T,
        public fillMethod: DataFillMethod,
        rawData?: MySQL2RawData[]
    ) {
        this.metadata = this.loadMetadata()
        this.mySQL2RawData = rawData ?? []
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get raw(): RawData<T> | RawData<T>[] {
        return this._raw ?? this.parseRaw()
    }

    // ------------------------------------------------------------------------

    public get entity(): InstanceType<T> | InstanceType<T>[] {
        return this._entity ?? this.parseEntity()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public parseRaw(rawData?: MySQL2RawData[]): RawData<T> | RawData<T>[] {
        if (rawData) this.mySQL2RawData = rawData
        if (!this.mySQL2RawData) throw new Error

        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'raw'
        )
        this._raw = this.fillMethod === 'Many'
            ? reduced
            : reduced[0]

        return this._raw
    }

    // ------------------------------------------------------------------------

    public parseEntity(rawData?: MySQL2RawData[]): (
        InstanceType<T> | Collection<InstanceType<T>>
    ) {
        if (rawData) this.mySQL2RawData = rawData
        if (!this.mySQL2RawData) throw new Error

        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'entity'
        ) as (
                InstanceType<T>[]
            )

        this._entity = this.fillMethod === 'Many'
            ? new Collection(...reduced)
            : reduced[0]

        return this._entity
    }

    // Privates ---------------------------------------------------------------
    private loadMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private reduceMySQL2RawData(
        rawData: MySQL2RawData[],
        metadata: EntityMetadata = this.metadata,
        method: 'raw' | 'entity' = 'raw',
        relation?: RelationMetadataType
    ): MappedDataType<T, typeof method>[] {
        if (rawData.length === 0) return rawData

        const [fisrtAlias] = Object.keys(rawData[0])[0].split('_')
        rawData = rawData.map(raw => this.removeAlias(raw, fisrtAlias))

        const reduced: MappedDataType<T, typeof method>[] = method === 'raw'
            ? []
            : relation
                ? new RelationCollection(relation)
                : new Collection<InstanceType<T>>

        const mapped = new Set
        const primaryName = metadata.columns.primary.name

        for (const data of rawData) {
            const primary = data[primaryName]

            if (mapped.has(primary)) continue

            const toMerge = rawData.filter(
                item => item[primaryName] === primary
            )

            const columns = this.filterColumns(toMerge[0])
            const relations = this.filterRelations(
                toMerge, columns, metadata, method
            )

            mapped.add(primary)
            const reducedData = { ...columns, ...relations }

            switch (method) {
                case "raw": reduced.push(reducedData)
                    break

                case "entity": reduced.push(
                    (new metadata.target() as InstanceType<T>).fill(
                        reducedData as any
                    )
                )
                    break
            }
        }

        return reduced
    }

    // ------------------------------------------------------------------------

    private filterColumns(raw: MySQL2RawData): RawData<T> {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        )) as (
                RawData<T>
            )
    }

    // ------------------------------------------------------------------------

    private filterRelations(
        raw: MySQL2RawData[],
        columns: RawData<T>,
        metadata: EntityMetadata = this.metadata,
        method: 'raw' | 'entity' = 'raw'
    ): { [K: string]: MappedDataType<T, typeof method> } {
        const relations: any = {}
        const relationKeys = this.filterRelationsKeys(raw)

        for (const key of relationKeys) {
            const toMerge = this.filterRelationsByKey(raw, key)
            if (toMerge.length === 0) continue

            const meta = metadata.relations!.find(({ name }) => name === key)!
            const fillMethod = RelationMetadata.relationFillMethod(meta)

            const nextMetadata = EntityMetadata.findOrBuild(
                RelationMetadata.extractEntityTarget(meta, columns)
            )
            const data = this.reduceMySQL2RawData(
                toMerge, nextMetadata, method, meta
            )
            relations[key] = fillMethod === 'Many' ? data : data[0]
        }

        return relations
    }

    // ------------------------------------------------------------------------

    private filterRelationsByKey(
        raw: MySQL2RawData[],
        key: string
    ): MySQL2RawData[] {
        return raw.map(item => Object.fromEntries(Object.entries(item).flatMap(
            ([path, value]) => path.startsWith(key)
                ? [[path, value]]
                : []
        )) as MySQL2RawData
        )
            .filter(item => !this.allNull(item))
    }

    // ------------------------------------------------------------------------

    private filterRelationsKeys(raw: MySQL2RawData[]): Set<string> {
        return new Set(raw.flatMap(item => Object.keys(item).flatMap(
            key => key.includes('_')
                ? key.split('_')[0]
                : []
        )))
    }

    // ------------------------------------------------------------------------

    private allNull(columns: RawData<T>): boolean {
        return Object.entries(columns)
            .map(([_, value]) => value)
            .every(value => value === null)
    }

    // ------------------------------------------------------------------------

    private removeAlias(raw: any, alias: string): any {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.startsWith(alias)
                ? [[key.replace(`${alias}_`, ''), value]]
                : []
        ))
    }
}

export {
    type MySQL2RawData,
    type RawData,
    type DataFillMethod
}