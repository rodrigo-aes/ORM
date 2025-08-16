import { PolymorphicEntityMetadata } from "../Metadata"
import { InternalUnionEntities } from "./Components"
import { ColumnsSnapshots } from "../BaseEntity"

// Decorators
import {
    ExcludeColumns,
    Combine
} from "../Decorators"

// Handlers
import { EntityBuilder } from "../Handlers"

// Types
import type { PolymorphicEntityTarget } from "../../types/General"
import type { SourceEntity } from "./types"
import type { UnionEntitiesMap } from "../Metadata"
import type { EntityProperties } from "../QueryBuilder"

export default abstract class BasePolymorphicEntity<Targets extends object[]> {
    protected hidden: string[] = []

    public entities: UnionEntitiesMap = this.getMetadata().entities

    public primaryKey: any
    public entityType!: string

    constructor(properties?: any) {
        if (properties) Object.assign(this, properties)
        this.getMetadata().computedProperties?.assign(this)

        ColumnsSnapshots.set(this, this.toJSON())
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getMetadata(): PolymorphicEntityMetadata {
        return PolymorphicEntityMetadata.find(this.constructor as PolymorphicEntityTarget)!
    }

    // ------------------------------------------------------------------------

    public toJSON<T extends BasePolymorphicEntity<Targets>>(this: T): (
        EntityProperties<T>
    ) {
        const json = Object.fromEntries([...this.getMetadata().columns].map(
            ({ name }) => [name, this[name as keyof typeof this]]
        )) as (
                EntityProperties<T>
            )

        return this.hide(json)
    }

    // ------------------------------------------------------------------------

    public hide<T extends BasePolymorphicEntity<Targets>>(
        this: T, json?: EntityProperties<T>
    ): EntityProperties<T> {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    public fill<T extends BasePolymorphicEntity<Targets>>(
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

    // Static Getters =========================================================
    // Decorators -------------------------------------------------------------
    public static get Combine() {
        return Combine
    }

    // ------------------------------------------------------------------------

    public static get Exclude() {
        return ExcludeColumns
    }
}

export {
    InternalUnionEntities
}