import DataType from "./DataType"

export default class FLOAT extends DataType {
    constructor(
        public M?: number,
        public D?: number,
    ) {
        super('float')
    }

    public override buildSQL(): string {
        return `FLOAT(${this.arguments()})`
    }

    private arguments() {
        let args = ''
        if (this.M) args += this.M.toString()
        if (this.D) args += `, ${this.D}`
    }
}