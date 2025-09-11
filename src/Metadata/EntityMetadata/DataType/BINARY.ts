import DataType from "./DataType"

export default class BINARY extends DataType {
    constructor(public length: number = 64) {
        super('binary')
    }

    public override buildSQL(): string {
        return `BINARY(${this.length})`
    }
}