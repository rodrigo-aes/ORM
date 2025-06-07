import type { EntityTarget } from "../../../../types/General"

export default class Collection<T extends EntityTarget> extends Array<
    InstanceType<T>
> { }