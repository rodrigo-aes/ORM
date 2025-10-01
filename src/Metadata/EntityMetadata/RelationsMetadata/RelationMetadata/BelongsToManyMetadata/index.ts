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
    public joinTableMetadata: JoinTableMetadata
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener

    constructor(
        public target: EntityTarget,
        { name, joinTable, ...options }: BelongsToManyOptions
    ) {
        super(target, name)

        Object.assign(this, options)
        this.joinTableMetadata = this.registerJoinTable(joinTable)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get JTName(): string {
        return `${this.joinTableMetadata.tableName}`
    }

    // ------------------------------------------------------------------------

    public get JTAlias(): string {
        return `__${this.JTName}JT`
    }

    // ------------------------------------------------------------------------

    public get JT(): string {
        return `${this.JTName} ${this.JTAlias}`
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): JoinColumnMetadata {
        return this.joinTableMetadata.getTargetColumn(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedFKName(): string {
        return `${this.JTAlias}.${this.relatedForeignKey.name}`
    }

    // ------------------------------------------------------------------------

    public get parentForeignKey(): JoinColumnMetadata {
        return this.joinTableMetadata.getTargetColumn(this.target)
    }

    // ------------------------------------------------------------------------

    public get parentFKname(): string {
        return `${this.JTAlias}.${this.parentForeignKey.name}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToManyMetadataJSON {
        return Object.fromEntries([
            ...Object.entries({
                entity: this.relatedMetadata.toJSON(),
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