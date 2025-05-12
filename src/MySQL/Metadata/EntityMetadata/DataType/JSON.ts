import DataType from "./DataType"

export default class JSON extends DataType {
    constructor(public length: number = 255) {
        super('json')
    }

    public override buildSQL(): string {
        return `JSON`
    }
}