import DataType from "./DataType"

export default class JSON extends DataType {
    constructor() {
        super('json')
    }

    public override buildSQL(): string {
        return `JSON`
    }
}