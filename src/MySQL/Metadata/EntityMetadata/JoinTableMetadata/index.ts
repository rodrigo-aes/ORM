import JoinColumnsMetadata, { JoinColumnMetadata } from "./JoinColumnsMetadata"

// Types
import type { EntityTarget } from "../../../../types/General"
import type { JoinTableRelated, JoinTableRelatedsGetter } from "./types"

export default class JoinTableMetadata {
    public columns!: JoinColumnsMetadata

    constructor(
        public relateds: JoinTableRelatedsGetter,
        private _tableName?: string
    ) {
        this.register()
        this.columns = this.buildColumns()
    }

    // Gettters ===============================================================
    // Publics ----------------------------------------------------------------
    public get tableName(): string {
        if (!this._tableName) this._tableName = this.getName()
        return this._tableName
    }

    // ------------------------------------------------------------------------

    public get targets(): [EntityTarget, EntityTarget] {
        return this.orderedRelateds().map(({ target }) => target) as (
            [EntityTarget, EntityTarget]
        )
    }

    // ------------------------------------------------------------------------

    public get dependencies(): [EntityTarget, EntityTarget] {
        return this.targets
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public mergeRelateds(relateds: JoinTableRelatedsGetter) {
        const otherRelateds = relateds()
        const thisRelateds = this.relateds()

        const returns = thisRelateds.map(({ target, options }) => {
            target = this.resolveRelated(target)

            return ({
                target,
                options: options ?? otherRelateds
                    .find((rel) => rel.target === target)
                    ?.options
            })
        }) as [
                JoinTableRelated<EntityTarget>,
                JoinTableRelated<EntityTarget>
            ]

        this.relateds = () => returns
        this.columns = this.buildColumns()
    }

    // Protecteds -------------------------------------------------------------
    protected register() {
        const data: JoinTableMetadata[] = [
            ...(
                Reflect.getOwnMetadata('join-tables', JoinTableMetadata) ?? []
            ),
            this
        ]

        Reflect.defineMetadata('join-tables', data, JoinTableMetadata)
    }

    // Privates ---------------------------------------------------------------

    private buildColumns() {
        const columns = new JoinColumnsMetadata(this)

        for (const { target, options } of this.orderedRelateds()) {
            columns.registerColumn({ referenced: () => target, ...options })
        }

        return columns
    }

    // ------------------------------------------------------------------------

    private getName(): string {
        return this.orderedRelateds()
            .map(({ target }) => target.name.toLowerCase())
            .join('_')
    }

    // ------------------------------------------------------------------------

    protected orderedRelateds(): [
        JoinTableRelated<EntityTarget>,
        JoinTableRelated<EntityTarget>
    ] {
        return this.relateds()
            .map(({ target, options }) => ({
                target: this.resolveRelated(target),
                options
            }))
            .sort(
                ({ target }, b) => target.name.localeCompare(b.target.name)
            ) as [
                JoinTableRelated<EntityTarget>,
                JoinTableRelated<EntityTarget>
            ]

    }

    // ------------------------------------------------------------------------

    private resolveRelated(related: Function): EntityTarget {
        try { return related() }
        catch (error) { }

        return related as EntityTarget
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static all(): JoinTableMetadata[] {
        return Reflect.getOwnMetadata(
            'join-tables', JoinTableMetadata
        ) ?? []
    }

    // ------------------------------------------------------------------------

    public static makeUniqueJoinTables(): void {
        const included: JoinTableMetadata[] = []

        for (const table of this.all()) {
            const existent = included.find(({ targets }) => targets.every(
                target => table.targets.includes(target)
            ))

            if (existent) existent.mergeRelateds(table.relateds)
            else included.push(table)
        }

        Reflect.defineMetadata('join-tables', included, JoinTableMetadata)
    }

    // ------------------------------------------------------------------------

    public static findByTarget(target: EntityTarget): JoinTableMetadata[] {
        return this.all().filter(({ targets }) => targets.includes(target))
    }
}

export {
    JoinColumnMetadata,
    JoinColumnsMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
}