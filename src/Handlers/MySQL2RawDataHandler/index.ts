import {
    EntityMetadata,
    PolymorphicEntityMetadata,
    RelationMetadata,
    MetadataHandler,
    CollectionsMetadataHandler,
    PaginationMetadataHandler,

    type RelationMetadataType
} from "../../Metadata"

// Base Entity
import BaseEntity, {
    Collection,
    type PaginationInitMap
} from "../../BaseEntity"
import BasePolymorphicEntity from "../../BasePolymorphicEntity"

// Types
import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types/General"

import type {
    MySQL2RawData,
    MappedDataType,
    RawData,
    DataFillMethod
} from "./types"

export default class MySQL2RawDataHandler<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    private metadata: EntityMetadata | PolymorphicEntityMetadata
    private mySQL2RawData!: MySQL2RawData[]
    private _raw?: RawData<T> | RawData<T>[]

    constructor(
        public target: T,
        public fillMethod: DataFillMethod,
        rawData?: MySQL2RawData[]
    ) {
        this.metadata = MetadataHandler.loadMetadata(this.target)
        this.mySQL2RawData = rawData ?? []
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get raw(): RawData<T> | RawData<T>[] {
        return this._raw ?? this.parseRaw()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public parseRaw(): RawData<T> | RawData<T>[] {
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

    public parseEntity<
        Target extends EntityTarget | PolymorphicEntityTarget = T
    >(
        mapToEntity?: Target,
        pagination?: PaginationInitMap
    ): InstanceType<Target> | Collection<InstanceType<Target>> {
        if (!this.mySQL2RawData) throw new Error

        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'entity',
            undefined,
            mapToEntity
        ) as InstanceType<T>[]

        switch (this.fillMethod) {
            case "One": return reduced[0] as any
            case "Many": return CollectionsMetadataHandler.build(
                mapToEntity ?? this.target,
                reduced
            ) as any


            case "Paginate": return PaginationMetadataHandler.build(
                mapToEntity ?? this.target,
                pagination!,
                reduced
            ) as any
        }
    }

    // Privates ---------------------------------------------------------------
    private reduceMySQL2RawData<
        Target extends EntityTarget | PolymorphicEntityTarget = T
    >(
        rawData: MySQL2RawData[],
        metadata: EntityMetadata | PolymorphicEntityMetadata = this.metadata,
        method: 'raw' | 'entity' = 'raw',
        relation?: RelationMetadataType,
        entityToMap?: Target
    ): MappedDataType<Target, typeof method>[] {
        if (rawData.length === 0) return rawData

        rawData = rawData.map(rd => this.removeAlias(
            rd, this.firstAlias(rawData)
        ))

        const reduced: MappedDataType<Target, typeof method>[] =
            method === 'raw'
                ? []
                : new Collection<InstanceType<Target>>

        const mapped = new Set
        const primaryName = metadata.columns.primary.name

        for (const data of rawData) {
            const primary = data[primaryName]
            if (mapped.has(primary)) continue

            const toMerge = rawData.filter(item => (
                item[primaryName] === primary
            ))

            const reducedData = {
                ...this.filterColumns<Target>(toMerge[0]),
                ...this.filterRelations<Target>(
                    toMerge,
                    metadata,
                    method
                )
            }

            switch (method) {
                case "raw": reduced.push(reducedData)
                    break

                case "entity": reduced.push(
                    this.mapToEntity(
                        entityToMap ?? metadata.target!,
                        reducedData,
                        relation?.type === 'PolymorphicBelongsTo'
                    ) as InstanceType<Target>
                )
                    break
            }

            mapped.add(primary)
        }

        return reduced
    }

    // ------------------------------------------------------------------------

    private mapToEntity(
        target: EntityTarget | PolymorphicEntityTarget,
        data: any,
        toSource: boolean
    ): BaseEntity | BasePolymorphicEntity<any> {
        switch (true) {
            case BaseEntity.prototype.isPrototypeOf(target.prototype): return (
                new target(data)
            )

            case BasePolymorphicEntity
                .prototype
                .isPrototypeOf(target.prototype): return (
                    this.mapToPolymorphicEntity(
                        target as PolymorphicEntityTarget,
                        data,
                        toSource
                    )
                )
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    private mapToPolymorphicEntity<ToSource extends boolean>(
        target: PolymorphicEntityTarget,
        data: any,
        toSource: ToSource
    ): BaseEntity | BasePolymorphicEntity<any> {
        data = this.handlePolymorphicKeys(data)

        return toSource
            ? new target(data).toSourceEntity()
            : new target(data)
    }

    // ------------------------------------------------------------------------

    private handlePolymorphicKeys(data: any): any {
        if (data.primaryKey && data.entityType) return data

        const sourcePrimary = this.metadata.columns.primary.name
        data.primaryKey = data[sourcePrimary]
        data.entityType = this.metadata.target!.name

        return data
    }

    // ------------------------------------------------------------------------

    private filterColumns<
        Target extends EntityTarget | PolymorphicEntityTarget = T
    >(raw: MySQL2RawData): RawData<Target> {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        )) as (
                RawData<Target>
            )
    }

    // ------------------------------------------------------------------------

    private filterRelations<
        Target extends EntityTarget | PolymorphicEntityTarget = T
    >(
        raw: MySQL2RawData[],
        metadata: EntityMetadata | PolymorphicEntityMetadata = this.metadata,
        method: 'raw' | 'entity' = 'raw'
    ): { [K: string]: MappedDataType<Target, typeof method> } {
        const relations: any = {}
        const relationKeys = this.filterRelationsKeys(raw)

        for (const key of relationKeys) {
            const toMerge = this.filterRelationsByKey(raw, key)
            if (toMerge.length === 0) continue

            const relationMetadata = metadata.relations!.find(
                ({ name }) => name === key
            )!

            const fillMethod = RelationMetadata.relationFillMethod(
                relationMetadata
            )

            const nextMetadata = MetadataHandler.loadMetadata(
                relationMetadata.relatedTarget
            )

            const data = this.reduceMySQL2RawData(
                toMerge, nextMetadata, method, relationMetadata
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
            ([path, value]) => path.startsWith(`${key}_`)
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
            ([key, value]) => key.startsWith(`${alias}_`)
                ? [[key.replace(`${alias}_`, ''), value]]
                : []
        ))
    }

    // ------------------------------------------------------------------------

    private firstAlias(rawData: any): string {
        return Object.keys(rawData[0])[0].split('_')[0]
    }
}

export {
    type MySQL2RawData,
    type RawData,
    type DataFillMethod
}