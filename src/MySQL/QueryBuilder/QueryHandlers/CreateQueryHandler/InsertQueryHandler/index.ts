import CreateQueryHandler from "../CreateQueryHandler"

import CreateQueryBuilder, {
    type EntityCreationAttributes,
} from "../../../CreateQueryBuilder"

// Types
import type { EntityTarget } from "../../../../../types/General"

export default class InsertQueryHandler<
    T extends EntityTarget
> extends CreateQueryHandler<T> {
    private entity!: InstanceType<T>

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public values(...values: any[]): this {
        this.queryBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public async exec(): Promise<InstanceType<T>> {
        this.queryBuilder.bulk = false
        this.mapEntity()
        const { insertId } = await this.executeQuery()
        this.fillEntityPrimaryKey(insertId)

        return this.entity
    }

    // Privates ---------------------------------------------------------------
    private mapEntity(): void {
        this.entity = this.mapToEntities() as InstanceType<T>
    }

    // ------------------------------------------------------------------------

    private fillEntityPrimaryKey(value: any): void {
        const primaryKey = this.metadata.columns.primary

        if (primaryKey.autoIncrement) {
            const name = primaryKey.name
            this.entity[name as keyof InstanceType<T>] = value
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static create<T extends EntityTarget>(
        target: T,
        attributes: EntityCreationAttributes<InstanceType<T>>,
        alias?: string
    ): Promise<InstanceType<T>> {
        return new InsertQueryHandler(
            target,
            alias,
            new CreateQueryBuilder(
                target,
                attributes,
                alias
            )
        )
            .exec()
    }
}