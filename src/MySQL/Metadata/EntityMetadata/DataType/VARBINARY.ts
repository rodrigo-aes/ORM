import DataType from "./DataType"

export default class VARBINARY extends DataType {
    constructor(public length: number = 255) {
        super('varbinary')
    }

    public override buildSQL(): string {
        return `VARBINARY(${this.length})`
    }
}