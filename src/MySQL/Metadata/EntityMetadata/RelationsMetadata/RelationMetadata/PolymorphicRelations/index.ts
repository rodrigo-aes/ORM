import PolymorphicHasOneMetadata from "./PolymorphicHasOneMetadata"
import PolymorphicHasManyMetadata from "./PolymorphicHasManyMetadata"
import PolymorphicBelongsToMetadata from "./PolymorphicBelongsToMetadata"

import type {
    PolymorphicParentOptions,
    PolymorphicParentRelatedGetter,

    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter
} from "./types"

export {
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicParentRelatedGetter,
    type PolymorphicChildOptions,
    type PolymorphicChildRelatedGetter,
}