// SQL Builder
import UpdateOrCreateSQLBuilder from "../../UpdateOrCreateSQLBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { EntityTarget, AsEntityTarget } from "../../../../types/General"
import type { EntityPropertiesKeys } from "../../types"
import type {
    UpdateOrCreateAttibutes
} from "../../UpdateOrCreateSQLBuilder/types"
export default class UpdateOrCreateQueryBuilder<T extends EntityTarget> {
    private sqlBuilder: UpdateOrCreateSQLBuilder<T>

    constructor(
        public target: T,
        public alias?: string
    ) {
        this.sqlBuilder = this.instantiateSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public fields(...names: EntityPropertiesKeys<InstanceType<T>>[]): this {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public data(data: UpdateOrCreateAttibutes<InstanceType<T>>): this {
        this.sqlBuilder.fields(...Object.keys(data) as (
            EntityPropertiesKeys<InstanceType<T>>[]
        ))

        this.sqlBuilder.values(...Object.values(data))

        return this
    }

    // ------------------------------------------------------------------------

    public exec(): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder as UpdateOrCreateSQLBuilder<AsEntityTarget<T>>,
            'entity'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // Privates ---------------------------------------------------------------
    private instantiateSQLBuilder(): UpdateOrCreateSQLBuilder<T> {
        return new UpdateOrCreateSQLBuilder(
            this.target,
            {},
            this.alias
        )
    }
}