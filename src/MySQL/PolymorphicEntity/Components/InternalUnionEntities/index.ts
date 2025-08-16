import type { EntityUnionTarget } from "../../../../types/General";

class InternalUnionEntities extends Map<
    string,
    EntityUnionTarget
> { }

export default new InternalUnionEntities