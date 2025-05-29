import EntityMetadata from "../../../"

import type { EntityTarget } from "../../../../../../types/General"
import ColumnMetadata from '..'
import type { RelatedEntitiesMap } from "../../../RelationsMetadata"
import type {
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    RelatedColumnsMap,

    ForeignKeyReferencesJSON
} from "./types"

export default class ForeignKeyReferences {
    public constrained: boolean = true
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener
    public scope?: any

    public referenced!: ForeignKeyReferencedGetter

    constructor(
        public target: EntityTarget,
        private columnName: string,
        initMap: ForeignKeyReferencesInitMap
    ) {
        Object.assign(this, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
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

    // ------------------------------------------------------------------------

    public get name(): string | undefined {
        if (this.constrained) return `fk_${this.tableName}_${this.columnName}`
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

export type {
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignKeyReferencesJSON
}