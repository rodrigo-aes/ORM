import DataType from "./DataType"

export default class VARCHAR extends DataType {
    constructor(public length: number = 255) {
        super('varchar')
    }

    public override buildSQL(): string {
        return `VARCHAR(${this.length})`
    }
}