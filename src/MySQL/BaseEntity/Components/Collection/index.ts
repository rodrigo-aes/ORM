import { ComputedPropertiesMetadata } from "../../../Metadata"

// Types
import type { CollectionTarget } from "../../../../types/General"
import type BaseEntity from "../.."
import type BasePolymorphicEntity from "../../../BasePolymorphicEntity"
import type { EntityProperties, UpdateAttributes } from "../../../SQLBuilders"

export default class Collection<
    Entity extends BaseEntity | BasePolymorphicEntity<any>
> extends Array<Entity> {
    public static alias: string = this.name

    protected hidden: string[] = []

    constructor(...entities: Entity[]) {
        super(...entities)

        this.assignComputedProperties()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getComputedPropertiesMetadata(): (
        ComputedPropertiesMetadata | undefined
    ) {
        return ComputedPropertiesMetadata.find(
            this.constructor as CollectionTarget
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): (
        ({ [K in keyof this]: any } & { data: Entity[] }) | Entity[]
    ) {
        return this.hasComputedProperties()
            ? this.hide({
                ...this.computedPropertiesJSON(),
                data: this.map((entity: any) => entity.toJSON())
            })

            : this.map((entity: any) => entity.toJSON())
    }

    // ------------------------------------------------------------------------

    public hide(json?: any): (
        { [K in keyof this]: any } & { data: Entity[] } | Entity[]
    ) {
        if (!json) json = this.toJSON()
        for (const key of this.hidden) delete json[key as keyof typeof json]

        return json
    }

    // ------------------------------------------------------------------------

    public fill(data: Partial<EntityProperties<Entity>>): this {
        for (const entity of this) (entity as any).fill(data)
        return this
    }

    // ------------------------------------------------------------------------

    public async save(): Promise<this> {
        for (const entity of this) await (entity as any).save()
        return this
    }

    // ------------------------------------------------------------------------

    public async update(
        attributes: UpdateAttributes<Entity>,
        filter?: (value: Entity, index: number, array: Entity[]) => boolean
    ): Promise<Entity[]> {
        const entities = filter ? this.filter(filter) : [...this]

        for (const entity of entities) await (entity as any).update(
            attributes
        )

        return entities
    }

    // ------------------------------------------------------------------------

    public async delete(
        filter: (value: Entity, index: number, array: Entity[]) => boolean
    ): Promise<Entity[]> {
        const entities = filter ? this.filter(filter) : [...this]

        for (const entity of entities) await (entity as any).delete()
        for (const entity of entities) this.splice(this.indexOf(entity), 1)

        return entities
    }

    // Protecteds -------------------------------------------------------------
    protected assignComputedProperties(): void {
        this.getComputedPropertiesMetadata()?.assign(this)
    }

    // ------------------------------------------------------------------------

    protected hasComputedProperties(): boolean {
        return !!this.getComputedPropertiesMetadata()
    }

    // ------------------------------------------------------------------------

    protected computedPropertiesKeys(): string[] {
        return [
            ...(this.getComputedPropertiesMetadata()?.keys() as (
                IterableIterator<string>
            ))
        ]
    }

    // ------------------------------------------------------------------------

    protected computedPropertiesJSON(): any {
        return Object.fromEntries(
            Object.entries(this).filter(
                ([key]) => this.computedPropertiesKeys().includes(key)
            )
        )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static computedPropertiesMetadata(): (
        ComputedPropertiesMetadata | undefined
    ) {
        return ComputedPropertiesMetadata.find(this)
    }
}