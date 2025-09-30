import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."

// Types
import type { EntityTarget } from "../../../../../types"
import type JoinTableMetadata from "../../../JoinTablesMetadata/JoinTableMetadata"
import type { JoinColumnMetadata } from "../../../JoinTablesMetadata/JoinTableMetadata"
import type { ForeignKeyActionListener } from "../../.."
import type {
    BelongsToManyRelatedGetter,
    BelongsToManyOptions,
    BelongsToManyMetadataJSON
} from "./types"

export default class BelongsToManyMetadata extends RelationMetadata {
    public related!: BelongsToManyRelatedGetter
    public joinTable: JoinTableMetadata
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener

    constructor(
        target: EntityTarget,
        { name, joinTable, ...options }: BelongsToManyOptions
    ) {
        super(target, name)

        Object.assign(this, options)
        this.joinTable = this.registerJoinTable(joinTable)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get entityName(): string {
        return this.entity.name
    }

    // ------------------------------------------------------------------------

    public get entityForeignKey(): JoinColumnMetadata {
        return this.joinTable.getTargetColumn(this.related())
    }

    // ------------------------------------------------------------------------

    public get targetForeignKey(): JoinColumnMetadata {
        return this.joinTable.getTargetColumn(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToManyMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.entity.toJSON(),
                type: this.type
            }),
            ...Object.entries(this).filter(
                ([key]) => [
                    'name',
                    'onDelete',
                    'onUpdate'
                ]
                    .includes(key)
            )
        ]) as BelongsToManyMetadataJSON
    }

    // Privates ---------------------------------------------------------------
    private registerJoinTable(name?: string) {
        return EntityMetadata.findOrBuild(this.target).addJoinTable(
            () => [
                {
                    target: this.target,
                    options: {
                        onDelete: this.onDelete,
                        onUpdate: this.onUpdate
                    }
                },
                {
                    target: this.related
                }
            ],
            name
        )
    }
}

export type {
    BelongsToManyRelatedGetter,
    BelongsToManyOptions,
    BelongsToManyMetadataJSON
}