import DataType from "../DataType"
import type { JSONColumnConfig } from "./types"

export default class JSONReference extends DataType {
    constructor(private dataType: DataType, public config: JSONColumnConfig) {
        super(dataType.type)
    }

    public override buildSQL(): string {
        return `
            ${this.dataType.buildSQL()} GENERATED ALWAYS 
            ${this.as()} 
            ${this.config.type}
        `
    }

    private as() {
        return `AS (JSON_UNQUOTE(
            JSON_EXTRACT(${this.config.json}, '$.${this.config.path}')
        ))`
    }
}

export type {
    JSONColumnConfig
}