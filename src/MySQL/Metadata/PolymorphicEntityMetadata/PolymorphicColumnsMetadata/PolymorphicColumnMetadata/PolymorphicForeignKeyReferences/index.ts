import PolymorphicEntityMetadata from "../../.."
import EntityMetadata from "../../../../EntityMetadata"

import type { PolymorphicEntityTarget } from "../../../../../../types/General"

import type {
    ForeignKeyActionListener,
    ForeignKeyReferencedGetter,
} from "../../../../EntityMetadata"

import type {
    ForeignKeyReferencesInitMap
} from "../../../../EntityMetadata/ColumnsMetadata"

import {
    ColumnMetadata,
    type ForeignKeyReferencesJSON,
} from "../../../../EntityMetadata"

import type {
    RelatedEntitiesMap
} from "../../../../EntityMetadata/RelationsMetadata"

import type {
    RelatedColumnsMap
} from "../../../../EntityMetadata/ColumnsMetadata/ColumnMetadata/ForeignKeyReferences/types"

export default class PolymorphicForeignKeyReferences {
    public constrained: boolean = true
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener
    public scope?: any

    public referenced!: ForeignKeyReferencedGetter

    constructor(
        public target: PolymorphicEntityTarget,
        private columnName: string,
        initMap: ForeignKeyReferencesInitMap
    ) {
        Object.assign(this, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): PolymorphicEntityMetadata {
        return PolymorphicEntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get entity(): EntityMetadata | RelatedEntitiesMap {
        return this.getEntity()
    }

    // ------------------------------------------------------------------------

    public get column(): ColumnMetadata | RelatedColumnsMap {
        return this.getColumn()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): ForeignKeyReferencesJSON {
        return Object.fromEntries(
            [
                ...Object.entries({
                    entity: this.entityToJSON(),
                    column: this.columnToJSON(),
                }),
                ...Object.entries(this).filter(
                    ([key]) => [
                        'name',
                        'constrained',
                        'onDelete',
                        'onUpdate',
                        'scope',
                    ]
                        .includes(key)
                )
            ]
        ) as ForeignKeyReferencesJSON
    }

    // Privates ---------------------------------------------------------------
    private getEntity() {
        const referenced = this.referenced()

        if (Array.isArray(referenced)) {
            const entitiesMap: RelatedEntitiesMap = {}
            for (const ref of referenced) {
                entitiesMap[ref.name] = EntityMetadata.findOrBuild(ref)
            }

            return entitiesMap
        }

        else return EntityMetadata.findOrBuild(referenced)
    }

    // ------------------------------------------------------------------------

    private getColumn() {
        if (this.entity instanceof EntityMetadata) {
            return this.entity.columns.primary
        }

        else {
            const map: RelatedColumnsMap = {}
            for (const [name, entity] of Object.entries(this.entity)) {
                map[name] = entity.columns.primary
            }

            return map
        }
    }

    // ------------------------------------------------------------------------

    private entityToJSON() {
        return this.entity instanceof EntityMetadata
            ? this.entity.toJSON()
            : Object.fromEntries(Object.entries(this.entity).map(
                ([key, entity]) => [key, entity.toJSON()]
            ))
    }

    // ------------------------------------------------------------------------

    private columnToJSON() {
        return this.column instanceof ColumnMetadata
            ? this.column.toJSON()
            : Object.fromEntries(Object.entries(this.column).map(
                ([key, column]) => [key, column.toJSON()]
            ))
    }
}