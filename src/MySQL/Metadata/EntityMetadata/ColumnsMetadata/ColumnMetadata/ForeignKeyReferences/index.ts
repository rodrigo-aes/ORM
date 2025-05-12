import EntityMetadata from "../../../"

import type { EntityTarget } from "../../../../../../types/General"
import type ColumnMetadata from '..'
import type { RelatedEntitiesMap } from "../../../RelationsMetadata"
import type {
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    RelatedColumnsMap
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
    // Privates --------------------------------------------------------------
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
}

export type {
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener
}