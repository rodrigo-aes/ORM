import type { PolymorphicEntityTarget } from "../../../../types/General";

class InternalPolymorphicEntities extends Map<
    string,
    PolymorphicEntityTarget
> { }

export default new InternalPolymorphicEntities