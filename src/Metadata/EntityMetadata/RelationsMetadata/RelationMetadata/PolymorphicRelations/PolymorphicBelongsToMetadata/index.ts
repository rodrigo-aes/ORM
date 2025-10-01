import EntityMetadata from "../../../.."
import PolymorphicEntityMetadata from "../../../../../PolymorphicEntityMetadata"
import RelationMetadata from "../../RelationMetadata"

// Handlers
import MetadataHandler from "../../../../../MetadataHandler"
import {
    InternalPolymorphicEntities
} from "../../../../../../BasePolymorphicEntity"

// Types
import type {
    Target,
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../../../types"
import type { ColumnMetadata } from "../../../../ColumnsMetadata"
import type {
    PolymorphicColumnMetadata
} from "../../../../../PolymorphicEntityMetadata"
import type { RelatedEntitiesMap } from "../../types"
import type {
    PolymorphicParentOptions,
    PolymorphicParentRelatedGetter
} from "../types"
import type { PolymorphicBelongsToMetadataJSON } from "./types"

export default class PolymorphicBelongsToMetadata extends RelationMetadata {
    private _relatedMetadata?: PolymorphicEntityMetadata | RelatedEntitiesMap

    public related!: PolymorphicParentRelatedGetter
    public scope?: any

    public FKName: string
    public TKName?: string

    constructor(
        target: Target,
        { name, typeKey, foreignKey, ...options }: PolymorphicParentOptions
    ) {
        super(target, name)

        Object.assign(this, options)

        this.FKName = foreignKey
        this.TKName = typeKey

        this.registerPolymorphicParent()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): PolymorphicEntityTarget {
        return this.relatedMetadata instanceof PolymorphicEntityMetadata
            ? this.relatedMetadata.target
            : InternalPolymorphicEntities.get(this.relatedTargetName) as (
                PolymorphicEntityTarget
            )
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): (
        PolymorphicEntityMetadata | RelatedEntitiesMap
    ) {
        return this._relatedMetadata = (
            this._relatedMetadata ?? this.loadEntities()
        )
    }

    // ------------------------------------------------------------------------ 

    public get relatedTable(): string {
        return this.relatedMetadata instanceof PolymorphicEntityMetadata
            ? this.relatedMetadata.tableName
            : `${this.target.name.toLowerCase()}_${this.name}`
    }
    // ------------------------------------------------------------------------

    public get relatedTargetName(): string {
        return this.relatedMetadata instanceof PolymorphicEntityMetadata
            ? this.relatedMetadata.target.name
            : this.relatedTable.split('_')
                .map(word => (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ))
                .join('')
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata | PolymorphicColumnMetadata {
        return MetadataHandler.targetMetadata(this.target)
            .columns
            .findOrThrow(this.FKName)
    }

    // ------------------------------------------------------------------------

    public get typeColum(): (
        ColumnMetadata | PolymorphicColumnMetadata | undefined
    ) {
        if (this.TKName) return MetadataHandler.targetMetadata(this.target)
            .columns
            .findOrThrow(this.TKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicBelongsToMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entities: this.entitiesToJSON(),
                foreignKey: this.foreignKey.toJSON(),
                typeColumn: this.typeColum?.toJSON(),
                type: this.type
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'scope',
                ]
                    .includes(key)
            )
        ]) as PolymorphicBelongsToMetadataJSON
    }

    // Protecteds -------------------------------------------------------------
    protected loadEntities() {
        const related = this.related()

        return Array.isArray(related)
            ? Object.fromEntries(related.map(
                target => [target.name, MetadataHandler.targetMetadata(target)]
            ))
            : MetadataHandler.targetMetadata(
                related as PolymorphicEntityTarget
            )
    }

    // Privates ---------------------------------------------------------------
    private registerPolymorphicParent(): void {
        new PolymorphicEntityMetadata(undefined, this.relatedTable, this.related)
    }

    // ------------------------------------------------------------------------

    private entitiesToJSON() {
        return Object.fromEntries(
            Object.entries(this.relatedMetadata).map(
                ([key, entity]) => [key, entity.toJSON()]
            )
        )
    }
}

export {
    type PolymorphicBelongsToMetadataJSON
}