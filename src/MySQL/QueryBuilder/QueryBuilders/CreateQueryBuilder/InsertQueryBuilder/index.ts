import CreateQueryBuilder from "../CreateQueryBuilder"

// Types
import type { EntityTarget } from "../../../../../types/General"

export default class InsertQueryBuilder<
    T extends EntityTarget
> extends CreateQueryBuilder<T> {
    private entity!: InstanceType<T>

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public values(...values: any[]): this {
        this.SQLBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public async exec(): Promise<InstanceType<T>> {
        this.SQLBuilder.bulk = false
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
}