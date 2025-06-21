import { EntityUnionMetadata } from "../Metadata"
import { InternalUnionEntities } from "./Coponents"

import { ColumnsSnapshots } from "../BaseEntity"

// Handlers
import { EntityBuilder } from "../Handlers"

import type { UnionEntityTarget, EntityTarget } from "../../types/General"
import type { EntityName, UnionEntityMap, SourceEntity } from "./types"
import type { EntityProperties } from "../QueryBuilder"

export default class UnionEntity<Targets extends EntityTarget[]> {
    protected hidden: string[] = []

    public entities!: UnionEntityMap

    public primaryKey: any
    public entityType!: EntityName<Targets>

    constructor() {
        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getMetadata(): EntityUnionMetadata {
        return EntityUnionMetadata.find(this.constructor as UnionEntityTarget)!
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends UnionEntity<Targets>>(this: T): (
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

    public hide<T extends UnionEntity<Targets>>(
        this: T, json?: EntityProperties<T>
    ): EntityProperties<T> {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
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