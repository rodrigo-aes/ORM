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
    Target,
    TargetMetadata,
    Entity,
    EntityTarget,
    PolymorphicEntityTarget
} from "../../types"

import type {
    MySQL2RawData,
    MappedDataType,
    RawData,
    DataFillMethod
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class MySQL2RawDataHandler<T extends Target> {
    private metadata: TargetMetadata<T>

    constructor(
        public target: T,
        public fillMethod: DataFillMethod,
        private mySQL2RawData: MySQL2RawData[]
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public parseRaw(): RawData<T> | RawData<T>[] {
        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'raw'
        )

        return this.fillMethod === 'Many'
            ? reduced
            : reduced[0]
    }

    // ------------------------------------------------------------------------

    public parseEntity<Entity extends Target = T>(
        mapToEntity?: Entity,
        pagination?: PaginationInitMap
    ): InstanceType<Entity> | Collection<InstanceType<Entity>> {
        const reduced = this.reduceMySQL2RawData(
            this.mySQL2RawData,
            this.metadata,
            'entity',
            undefined,
            mapToEntity
        ) as InstanceType<Entity>[]

        switch (this.fillMethod) {
            case "One": return reduced[0]

            case "Many": return CollectionsMetadataHandler.build(
                mapToEntity ?? this.target,
                reduced
            ) as Collection<InstanceType<Entity>>

            case "Paginate": return PaginationMetadataHandler.build(
                mapToEntity ?? this.target,
                pagination!,
                reduced
            ) as Collection<InstanceType<Entity>>
        }
    }

    // Privates ---------------------------------------------------------------
    private reduceMySQL2RawData<Entity extends Target = T>(
        rawData: MySQL2RawData[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'raw' | 'entity' = 'raw',
        relation?: RelationMetadataType,
        entityToMap?: Entity
    ): MappedDataType<Entity, typeof method>[] {
        if (rawData.length === 0) return rawData

        rawData = rawData.map(rd => this.removeAlias(
            rd, this.firstAlias(rawData)
        ))

        const reduced: MappedDataType<Entity, typeof method>[] =
            method === 'raw'
                ? []
                : new Collection<InstanceType<Entity>>

        const mapped = new Set
        const primaryName = metadata.columns.primary.name

        for (const data of rawData) {
            const primary = data[primaryName]
            if (mapped.has(primary)) continue

            const toMerge = rawData.filter(item => (
                item[primaryName] === primary
            ))

            const reducedData = {
                ...this.filterColumns<Entity>(toMerge[0]),
                ...this.filterRelations<Entity>(
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
                    ) as InstanceType<Entity>
                )
                    break
            }

            mapped.add(primary)
        }

        return reduced
    }

    // ------------------------------------------------------------------------

    private mapToEntity(target: Target, data: any, toSource: boolean): Entity {
        switch (true) {
            case BaseEntity
                .prototype
                .isPrototypeOf(target.prototype): return new target(data)

            // ----------------------------------------------------------------

            case BasePolymorphicEntity
                .prototype
                .isPrototypeOf(target.prototype): return (
                    this.mapToPolymorphicEntity(
                        target as PolymorphicEntityTarget,
                        data,
                        toSource
                    )
                )

            // ----------------------------------------------------------------

            default: throw PolyORMException.Metadata.instantiate(
                'INVALID_ENTITY', target.name
            )
        }
    }

    // ------------------------------------------------------------------------

    private mapToPolymorphicEntity<ToSource extends boolean>(
        target: PolymorphicEntityTarget,
        data: any,
        toSource: ToSource
    ): Entity {
        return toSource
            ? new target(this.handlePolymorphicKeys(data)).toSourceEntity()
            : new target(this.handlePolymorphicKeys(data))
    }

    // ------------------------------------------------------------------------

    private handlePolymorphicKeys(data: any): any {
        if (data.primaryKey && data.entityType) return data

        const sourcePrimary = this.metadata.columns.primary.name
        data.primaryKey = data[sourcePrimary]
        data.entityType = this.metadata.target.name

        return data
    }

    // ------------------------------------------------------------------------

    private filterColumns<Entity extends Target = T>(raw: MySQL2RawData): (
        RawData<Entity>
    ) {
        return Object.fromEntries(Object.entries(raw).flatMap(
            ([key, value]) => key.includes('_')
                ? []
                : [[key, value]]
        )) as RawData<Entity>
    }

    // ------------------------------------------------------------------------

    private filterRelations<Entity extends Target = T>(
        raw: MySQL2RawData[],
        metadata: TargetMetadata<any> = this.metadata,
        method: 'raw' | 'entity' = 'raw'
    ): { [K: string]: MappedDataType<Entity, typeof method> } {
        const relations: any = {}

        for (const key of Array.from(this.filterRelationsKeys(raw))) {
            const toMerge = this.filterRelationsByKey(raw, key)
            if (toMerge.length === 0) continue

            const relationMetadata = metadata.relations.findOrThrow(key)

            const fillMethod = RelationMetadata.fillMethod(
                relationMetadata
            )

            const nextMetadata = MetadataHandler.targetMetadata(
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
        return raw
            .map(item => Object.fromEntries(
                Object.entries(item).flatMap(
                    ([path, value]) => path.startsWith(`${key}_`)
                        ? [[path, value]]
                        : []
                )) as MySQL2RawData)
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