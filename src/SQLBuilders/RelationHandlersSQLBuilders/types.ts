import type HasOneHandlerSQLBuilder from "./HasOneHandlerSQLBuilder"
import type HasManyHandlerSQLBuilder from "./HasManyHandlerSQLBuilder"
import type BelongsToHandlerSQLBuilder from "./BelongsToHandlerSQLBuilder"
import type HasOneThroughHandlerSQLBuilder from "./HasOneThroughHandlerSQLBuilder"
import type HasManyThroughHandlerSQLBuilder from "./HasManyThroughHandlerSQLBuilder"
import type BelongsToThroughHandlerSQLBuilder from "./BelongsToThroughHandlerSQLBuilder"
import type BelongsToManyHandlerSQLBuilder from "./BelongsToManyHandlerSQLBuilder"
import type PolymorphicHasOneHandlerSQLBuilder from "./PolymorphicHasOneHandlerSQLBuilder"
import type PolymorphicHasManyHandlerSQLBuilder from "./PolymorphicHasManyHJandlerSQLBuilder"
import type PolymorphicBelongsToHandlerSQLBuilder from "./PolymorphicBelongsToHandlerSQLBuilder"

export type OneRelationHandlerSQLBuilder = (
    HasOneHandlerSQLBuilder<any, any> |
    BelongsToHandlerSQLBuilder<any, any> |
    HasOneThroughHandlerSQLBuilder<any, any> |
    BelongsToThroughHandlerSQLBuilder<any, any> |
    PolymorphicHasOneHandlerSQLBuilder<any, any> |
    PolymorphicBelongsToHandlerSQLBuilder<any, any>
)

export type ManyRelationHandlerSQLBuilder = (
    HasManyHandlerSQLBuilder<any, any> |
    HasManyThroughHandlerSQLBuilder<any, any> |
    BelongsToManyHandlerSQLBuilder<any, any> |
    PolymorphicHasManyHandlerSQLBuilder<any, any>
)