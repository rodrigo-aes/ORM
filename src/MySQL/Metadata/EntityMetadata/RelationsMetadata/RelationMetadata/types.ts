import type EntityMetadata from "../.."

export interface RelationOptions {
    name: string
}

export type RelatedEntitiesMap = {
    [key: string]: EntityMetadata
}