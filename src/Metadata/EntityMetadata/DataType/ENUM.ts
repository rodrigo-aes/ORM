import DataType from "./DataType"

export default class ENUM extends DataType {
    public options: string[]

    constructor(...options: string[]) {
        super('enum')
        this.options = options
    }

    public override buildSQL(): string {
        return `ENUM(${this.buildOptions()})`
    }

    private buildOptions(): string {
        return this.options.map(option => `'${option}'`).join(',')
    }
}