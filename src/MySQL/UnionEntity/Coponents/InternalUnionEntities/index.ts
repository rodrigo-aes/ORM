import type { UnionEntityTarget } from "../../../../types/General";

class InternalUnionEntities extends Map<
    string,
    UnionEntityTarget
> { }

export default new InternalUnionEntities