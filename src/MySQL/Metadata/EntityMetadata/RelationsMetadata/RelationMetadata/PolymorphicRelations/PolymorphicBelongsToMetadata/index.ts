import EntityMetadata from "../../../.."
import RelationMetadata from "../../RelationMetadata"

// Types
import type { EntityTarget } from "../../../../../../../types/General"
import type { EntityUnionTarget } from "../../../../../EntityUnionMetadata/types"
import type { ColumnMetadata } from "../../../.."
import type { RelatedEntitiesMap } from "../../types"
import type {
    PolymorphicParentOptions,
    PolymorphicParentRelatedGetter
} from "../types"

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
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entities(): RelatedEntitiesMap {
        return this._entities ?? this.getEntities()
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

    public get relatedTarget(): EntityUnionTarget {
        throw new Error
    }

    // ------------------------------------------------------------------------

    public get primaryKeyName(): string {
        return `${this.name}Id`
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected getEntities() {
        const related = this.related()
        this._entities = {}
        for (const rel of related) this._entities[rel.name] = this.getEntity(
            rel
        )

        return this._entities

    }

    // Privates ---------------------------------------------------------------
    private getEntity(target: EntityTarget) {
        return EntityMetadata.find(target)!
    }
}