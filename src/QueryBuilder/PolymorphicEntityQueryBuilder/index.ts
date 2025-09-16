import QueryBuilder from "../QueryBuilder"

// Types
import type { PolymorphicEntityTarget } from "../../types/General"
import type { PolymorphicEntityMetadata } from "../../Metadata"

export default class PolymorphicEntityQueryBuilder<
    T extends PolymorphicEntityTarget
> extends QueryBuilder<T> {
    declare protected metadata: PolymorphicEntityMetadata

    constructor(public target: T, alias?: string) {
        super(target, alias)
    }
}