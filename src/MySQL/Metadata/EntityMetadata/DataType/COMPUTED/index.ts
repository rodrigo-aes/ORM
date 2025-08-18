import DataType from "../DataType"
import type { ComputedConfig, ComputedType } from "./types"

export default class COMPUTED extends DataType {
    constructor(
        private dataType: DataType,
        public config: ComputedConfig
    ) {
        super(dataType.type)
    }

    public override buildSQL(): string {
        return `${this.dataType.buildSQL()} ${this.as()} ${this.config.type}`
    }

    private as() {
        return `AS (${this.config.as})`
    }
}

export {
    type ComputedConfig,
    type ComputedType
}