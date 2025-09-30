import { ScopesMetadata, type Scope } from "../../Metadata"
import DefaultScope from "./DefaultScope"

// Types
import type { EntityTarget, PolymorphicEntityTarget } from "../../types"

export default function Scopes(scopes: { [Name: string]: Scope }) {
    return function (target: EntityTarget | PolymorphicEntityTarget) {
        ScopesMetadata.findOrBuild(target).registerScopes(scopes)
    }
}

export {
    DefaultScope
}