import DataType from "./DataType"

export default class DOUBLE extends DataType {
    constructor(
        public M?: number,
        public D?: number,
    ) {
        super('double')
    }

    public override buildSQL(): string {
        return `DOUBLE(${this.arguments()})`
    }

    private arguments() {
        let args = ''
        if (this.M) args += this.M.toString()
        if (this.D) args += `, ${this.D}`
    }
}