import { ScopesMetadata, type Scope } from "../../Metadata"
import DefaultScope from "./DefaultScope"

// Types
import type { EntityTarget, UnionEntityTarget } from "../../../types/General"

export default function Scopes(scopes: { [Name: string]: Scope }) {
    return function (target: EntityTarget | UnionEntityTarget) {
        ScopesMetadata.findOrBuild(target).registerScopes(scopes)
    }
}

export {
    DefaultScope
}