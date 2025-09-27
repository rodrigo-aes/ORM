import PolyORMException from "../PolyORMException"

// Static
import {
    MetadataErrorCodes,
    MetadataErrorNoCodes,
    MetadataErrorStates,
    MetadataErrorMessages,

    type MetadataErrorCode,
} from "./Static"

export default class MetadataException extends PolyORMException<
    MetadataErrorCode,
    { [K in MetadataErrorCode]: typeof MetadataErrorNoCodes[K] },
    typeof MetadataErrorStates,
    typeof MetadataErrorMessages
> {
    constructor(code: MetadataErrorCode, ...args: any) {
        super(
            code,
            MetadataErrorNoCodes,
            MetadataErrorStates,
            MetadataErrorMessages,
            ...args
        )
    }
}

export {
    MetadataErrorCodes,
    type MetadataErrorCode,
}