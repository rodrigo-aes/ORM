import type {
    EntityTarget,
    PolymorphicEntityTarget
} from "../../../types"

export type ComputedPropertyFunction<
    T extends EntityTarget | PolymorphicEntityTarget = any
> = (value: any, entity: InstanceType<T>) => any | Promise<any>

export type ComputedPropertiesJSON = {
    [Prop: string]: ComputedPropertyFunction
}