import EntityBuilder from "./EntityBuilder"

// Types
import type { EntityTarget } from "../../types/General"
import type { CreationAttributes } from "../QueryBuilder"

export default class EntityHandler {
    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static build<T extends EntityTarget>(
        target: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> | InstanceType<T>[] {
        return new EntityBuilder(target, attributes).build()
    }

    // ------------------------------------------------------------------------

    public static attributesToEntities<T extends EntityTarget>(
        target: T,
        attributes: CreationAttributes<InstanceType<T>>
    ): InstanceType<T> | InstanceType<T>[] {
        const attribute = Array.isArray(attributes)
            ? attributes[0]
            : attributes

        return attribute instanceof target
            ? attributes as InstanceType<T> | InstanceType<T>[]
            : this.build(target, attributes)
    }
}