import EntityMetadata from "../../../.."
import RelationMetadata from "../../RelationMetadata"

// Types
import type { Target, EntityTarget } from "../../../../../../types"
import type { ColumnMetadata } from "../../../.."
import type {
    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter
} from "../types"
import type { PolymorphicHasManyMetadataJSON } from "./types"

export default class PolymorphicHasManyMetadata extends RelationMetadata {
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
    public toJSON(): PolymorphicHasManyMetadataJSON {
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
        ]) as PolymorphicHasManyMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private loadEntity() {
        return EntityMetadata.findOrBuild(this.related())
    }
}

export {
    type PolymorphicHasManyMetadataJSON
}