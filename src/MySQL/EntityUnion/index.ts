import { EntityUnionMetadata } from "../Metadata"
import { InternalUnionEntities } from "./Components"

import { ColumnsSnapshots } from "../BaseEntity"

// Handlers
import { EntityBuilder } from "../Handlers"

import type { UnionEntityTarget, EntityTarget } from "../../types/General"
import type { EntityName, SourceEntity } from "./types"
import type { UnionEntitiesMap } from "../Metadata"
import type { EntityProperties } from "../QueryBuilder"

export default class EntityUnion<Targets extends EntityTarget[]> {
    protected hidden: string[] = []

    public entities: UnionEntitiesMap

    public primaryKey: any
    public entityType!: EntityName<Targets>

    constructor() {
        this.entities = this.getMetadata().entities
        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getMetadata(): EntityUnionMetadata {
        return EntityUnionMetadata.find(this.constructor as UnionEntityTarget)!
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends EntityUnion<Targets>>(this: T): (
        EntityProperties<T>
    ) {
        const json = Object.fromEntries([...this.getMetadata().columns].map(
            ({ name }) => [name, this[name as keyof typeof this]]
        )) as (
                EntityProperties<T>
            )

        this.hide(json)

        return json
    }

    // ------------------------------------------------------------------------

    public hide<T extends EntityUnion<Targets>>(
        this: T, json?: EntityProperties<T>
    ): EntityProperties<T> {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    public fill<T extends EntityUnion<Targets>>(
        this: T,
        data: Partial<EntityProperties<T>>
    ): T {
        Object.assign(this, data)
        return this
    }

    // ------------------------------------------------------------------------


    public toSourceEntity(): SourceEntity<Targets> {
        return new EntityBuilder(
            this.entities[this.entityType],
            this
        )
            .build() as (
                SourceEntity<Targets>
            )
    }
}

export {
    InternalUnionEntities
}