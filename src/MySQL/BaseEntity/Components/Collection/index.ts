import type { EntityTarget } from "../../../../types/General"

export default class Collection<Entity extends object> extends Array<
    Entity
> { }