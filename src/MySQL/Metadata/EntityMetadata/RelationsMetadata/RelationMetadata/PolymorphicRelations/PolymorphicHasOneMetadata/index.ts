import RelationMetadata from "../../RelationMetadata"
import EntityMetadata from "../../../.."

// Types
import type { EntityTarget } from "../../../../../../../types/General"
import type { ColumnMetadata } from "../../../.."
import type {
    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter
} from "../types"
import type { PolymorphicHasOneMetadataJSON } from "./types"

export default class PolymorphicHasOneMetadata extends RelationMetadata {
    public related!: PolymorphicChildRelatedGetter
    public scope?: any

    private foreignKeyName: string
    public typeKey: string

    constructor(
        target: EntityTarget,
        { typeKey, foreignKey, ...options }: PolymorphicChildOptions
    ) {
        super(target, options)

        Object.assign(this, options)

        this.foreignKeyName = foreignKey
        this.typeKey = typeKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata {
        return this.loadEntity()
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get entityName(): string {
        return this.entity.target.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.entity.getColumn(this.foreignKeyName)
    }

    // ------------------------------------------------------------------------

    public get targetType(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get typeColumn(): ColumnMetadata {
        return this.entity.getColumn(this.typeKey)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicHasOneMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.entity.toJSON(),
                foreignKey: this.foreignKey.toJSON(),
                typeColumn: this.typeColumn.toJSON(),
                type: this.type
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'scope',
                ]
                    .includes(key)
            )
        ]) as PolymorphicHasOneMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private loadEntity() {
        return EntityMetadata.findOrBuild(this.related())
    }
}

export {
    type PolymorphicHasOneMetadataJSON
}