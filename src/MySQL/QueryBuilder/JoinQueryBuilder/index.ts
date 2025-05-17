import {
    EntityMetadata,
    RelationMetadata,

    type HasOneMetadata,
    type HasManyMetadata,
} from "../../Metadata"

import SelectQueryBuilder from "../SelectQueryBuilder"
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

import type { EntityTarget } from "../../../types/General"
import type {
    RelationsOptions,
    RelationOptions,
    EntityRelationsMap,
    EntityRelationMap
} from "./types"

export default abstract class JoinQueryBuilder<T extends EntityTarget> {
    private metadata: EntityMetadata

    public alias: string
    public map: EntityRelationsMap<InstanceType<T>>

    constructor(
        public target: T,
        public options: RelationsOptions<InstanceType<T>>,
        alias?: string
    ) {
        this.alias = alias ?? this.target.name.toLowerCase()
        this.metadata = this.getMetadata()
    }

    // Instance Methods =======================================================
    // Privates ---------------------------------------------------------------
    private getMetadata(): EntityMetadata {
        return EntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    private mapOptions(): EntityRelationsMap<InstanceType<T>> {
        for (const [relation, options] of Object.entries(this.options)) {
            const metadata = this.metadata.relations?.find(
                ({ name }) => name === relation
            )

            if (!relation) throw new Error


        }
    }

    // ------------------------------------------------------------------------

    private handleHasOne(
        relation: HasOneMetadata,
        options: RelationOptions<any>
    ): EntityRelationMap {
        const { select, on, relations } = options

        return {
            select: new SelectQueryBuilder(
                relation.target,
                select,
                this.alias
            )
        }
    }
}