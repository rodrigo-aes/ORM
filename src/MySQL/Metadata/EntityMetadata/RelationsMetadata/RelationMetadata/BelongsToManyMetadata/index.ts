import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."

// Types
import type { EntityTarget } from "../../../../../../types/General"
import type JoinTableMetadata from "../../../JoinTableMetadata"
import type { JoinColumnMetadata } from "../../../JoinTableMetadata"
import type { ForeignKeyActionListener } from "../../.."
import type { BelongsToManyRelatedGetter, BelongsToManyOptions } from "./types"

export default class BelongsToManyMetadata extends RelationMetadata {
    public related!: BelongsToManyRelatedGetter
    public joinTable: JoinTableMetadata
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener

    constructor(
        target: EntityTarget,
        { joinTable, ...options }: BelongsToManyOptions
    ) {
        super(target, options)

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
        return this.entity.target.name.toLowerCase()
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
    BelongsToManyOptions
}