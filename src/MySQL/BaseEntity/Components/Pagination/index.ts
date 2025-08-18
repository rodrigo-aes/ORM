import Collection from "../Collection"

// Types
import type BaseEntity from "../.."
import type BasePolymorphicEntity from "../../../BasePolymorphicEntity"
import type { PaginationInitMap } from "./types"

export default class Pagination<
    Entity extends BaseEntity | BasePolymorphicEntity<any>
> extends Collection<Entity> {
    public page: number = 1
    public perPage: number = 26
    public total: number = 0
    public pages: number = 1
    public prevPage: number | null = null
    public nextPage: number | null = null

    constructor(...entities: Entity[]) {
        super(...entities)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public assign(pagination: PaginationInitMap): this {
        Object.assign(this, pagination)

        this.pages = Math.ceil(this.total / this.perPage)
        this.prevPage = this.page > 1 ? this.page - 1 : null
        this.nextPage = this.page < this.pages ? this.page + 1 : null

        return this
    }

    // ------------------------------------------------------------------------

    public override toJSON(): (
        Entity[] | ({ [K in keyof this]: any } & { data: Entity[] })
    ) {
        return this.hide({
            page: this.page,
            perPage: this.perPage,
            total: this.total,
            pages: this.pages,
            prevPage: this.prevPage,
            nextPage: this.nextPage,

            ...this.computedPropertiesJSON(),

            data: [...this].map((entity: any) => entity.toJSON())
        })
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build<
        Entity extends BaseEntity | BasePolymorphicEntity<any>
    >(
        pagination: PaginationInitMap,
        data: Entity[] = []
    ): Pagination<Entity> {
        return new this(...data).assign(pagination)
    }
}

export {
    type PaginationInitMap
}