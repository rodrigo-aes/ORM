import type { PolymorphicEntityTarget } from "../../../../types/General";

class InternalUnionEntities extends Map<
    string,
    PolymorphicEntityTarget
> { }

export default new InternalUnionEntities