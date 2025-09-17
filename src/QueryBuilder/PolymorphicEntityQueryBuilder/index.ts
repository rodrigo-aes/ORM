import QueryBuilder from "../QueryBuilder"

// Types
import type {
    PolymorphicEntityTarget,
    TargetMetadata
} from "../../types/General"

export default class PolymorphicEntityQueryBuilder<
    T extends PolymorphicEntityTarget
> extends QueryBuilder<T> {
    declare protected metadata: TargetMetadata<T>

    constructor(public target: T, alias?: string) {
        super(target, alias)
    }
}