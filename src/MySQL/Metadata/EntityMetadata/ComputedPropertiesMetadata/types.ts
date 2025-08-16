import type {
    EntityTarget,
    EntityUnionTarget
} from "../../../../types/General"

export type ComputedPropertyFunction<
    T extends EntityTarget | EntityUnionTarget = any
> = (value: any, entity: InstanceType<T>) => any | Promise<any>