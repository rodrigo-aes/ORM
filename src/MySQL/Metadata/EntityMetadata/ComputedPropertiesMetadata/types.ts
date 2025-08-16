import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../../types/General"

export type ComputedPropertyFunction<
    T extends EntityTarget | PolymorphicEntityTarget = any
> = (value: any, entity: InstanceType<T>) => any | Promise<any>