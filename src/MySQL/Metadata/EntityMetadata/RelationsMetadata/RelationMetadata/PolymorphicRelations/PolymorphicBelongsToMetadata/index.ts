import EntityMetadata from "../../../.."
import EntityUnionMetadata from "../../../../../EntityUnionMetadata"
import RelationMetadata from "../../RelationMetadata"

import { InternalUnionEntities } from "../../../../../../BaseEntityUnion"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../../../../../types/General"
import type { ColumnMetadata } from "../../../.."
import type { RelatedEntitiesMap } from "../../types"
import type {
    PolymorphicParentOptions,
    PolymorphicParentRelatedGetter
} from "../types"
import type { PolymorphicBelongsToMetadataJSON } from "./types"

export default class PolymorphicBelongsToMetadata extends RelationMetadata {
    private _entities?: RelatedEntitiesMap

    public related!: PolymorphicParentRelatedGetter
    public scope?: any

    private foreignKeyName: string
    public typeKey: string

    constructor(
        target: EntityTarget,
        { typeKey, foreignKey, ...options }: PolymorphicParentOptions
    ) {
        super(target, options)

        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.typeKey = typeKey

        this.registerParentsUnion()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): RelatedEntitiesMap {
        return this._entities ?? this.loadEntities()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return EntityMetadata.findOrBuild(this.target)
            .getColumn(this.foreignKeyName)
    }

    // ------------------------------------------------------------------------

    public get targetName(): string {
        return this.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): UnionEntityTarget {
        return InternalUnionEntities.get(this.unionTargetName) as (
            UnionEntityTarget
        )
    }

    // ------------------------------------------------------------------------

    public get primaryKeyName(): string {
        return `${this.name}Id`
    }

    // ------------------------------------------------------------------------

    public get typeColum(): ColumnMetadata {
        return EntityMetadata.findOrBuild(this.target)
            .getColumn(this.typeKey)
    }

    // ------------------------------------------------------------------------

    public get unionName(): string {
        return `${this.target.name.toLowerCase()}_${this.name}`
    }

    // ------------------------------------------------------------------------

    public get unionTargetName(): string {
        return this.unionName.split('_')
            .map(word => (
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            ))
            .join('')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicBelongsToMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entities: this.entitiesToJSON(),
                foreignKey: this.foreignKey.toJSON(),
                typeColumn: this.typeColum.toJSON(),
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
        this._entities = {}
        for (const rel of related) this._entities[rel.name] = this.loadEntity(
            rel
        )

        return this._entities

    }

    // Privates ---------------------------------------------------------------
    private registerParentsUnion(): void {
        EntityUnionMetadata.findOrBuild(this.unionName, null, this.related)
    }

    // ------------------------------------------------------------------------

    private loadEntity(target: EntityTarget) {
        return EntityMetadata.find(target)!
    }

    // ------------------------------------------------------------------------

    private entitiesToJSON() {
        return Object.fromEntries(
            Object.entries(this.entities).map(
                ([key, entity]) => [key, entity.toJSON()]
            )
        )
    }
}

export {
    type PolymorphicBelongsToMetadataJSON
}