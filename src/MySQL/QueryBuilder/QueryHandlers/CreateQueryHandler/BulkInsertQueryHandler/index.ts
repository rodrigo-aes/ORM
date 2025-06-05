import CreateQueryHandler from "../CreateQueryHandler"

// Types
import type { EntityTarget } from "../../../../../types/General"

export default class BulkInsertQueryHandler<
    T extends EntityTarget
> extends CreateQueryHandler<T> {
    private entities!: InstanceType<T>[]

    // Instance Methods =======================================================
    public values(...values: any[][]): this {
        this.queryBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public async exec(): Promise<InstanceType<T>[]> {
        this.queryBuilder.bulk = true
        this.mapEntity()
        const { insertId } = await this.executeQuery()
        this.fillEntityPrimaryKey(insertId)

        return this.entities
    }

    // Privates ---------------------------------------------------------------
    private mapEntity(): void {
        this.entities = this.mapToEntities() as InstanceType<T>[]
    }

    // ------------------------------------------------------------------------

    private fillEntityPrimaryKey(value: any): void {
        const primaryKey = this.metadata.columns.primary

        if (primaryKey.autoIncrement) {
            const name = primaryKey.name

            for (const entity of this.entities) {
                entity[name as keyof InstanceType<T>] = value
                value++
            }
        }
    }
}