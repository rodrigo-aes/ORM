import type { EntityTarget } from "../../../../types/General"

export default class Collection<Entity extends object> extends Array<Entity> {
    public static alias: string = this.name

    constructor(...entities: Entity[]) {
        super(...entities)
    }
}