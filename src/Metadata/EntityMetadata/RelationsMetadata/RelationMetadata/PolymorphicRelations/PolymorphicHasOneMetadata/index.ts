import RelationMetadata from "../../RelationMetadata"
import EntityMetadata from "../../../.."

// Types
import type { Target, EntityTarget } from "../../../../../../types"
import type { ColumnMetadata } from "../../../.."
import type {
    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter
} from "../types"
import type { PolymorphicHasOneMetadataJSON } from "./types"

export default class PolymorphicHasOneMetadata extends RelationMetadata {
    public related!: PolymorphicChildRelatedGetter
    public scope?: any

    public FKName: string
    public TKName?: string

    constructor(
        target: Target,
        { name, typeKey, foreignKey, ...options }: PolymorphicChildOptions
    ) {
        super(target, name)

        Object.assign(this, options)

        this.FKName = foreignKey
        this.TKName = typeKey
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return this.loadEntity()
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FKName)
    }

    // ------------------------------------------------------------------------

    public get parentType(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get typeColumn(): ColumnMetadata | undefined {
        if (this.TKName) return this.relatedMetadata
            .columns
            .findOrThrow(this.TKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicHasOneMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.relatedMetadata.toJSON(),
                foreignKey: this.foreignKey.toJSON(),
                typeColumn: this.typeColumn?.toJSON(),
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