import FindQueryBuilder from "../FindQueryBuilder"

// Types
import type { EntityTarget } from "../../../types/General"

export default class FindOneQueryBuilder<
    T extends EntityTarget
> extends FindQueryBuilder<T> {
    public override limit = 1
}