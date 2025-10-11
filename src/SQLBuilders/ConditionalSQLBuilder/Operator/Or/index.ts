import Operator from "../Operator"
import OrSQLBuilder from "../../OrSQLBuilder"
import { Or } from "../Symbols"

export default class OrOperator extends Operator<typeof Or> {
    protected readonly operatorSQL: undefined

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return new OrSQLBuilder(
            this.target,
            this.value.map(val => ({ [this.columnName]: val })),
            this.alias
        )
            .SQL()
    }
} 