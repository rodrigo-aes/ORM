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
    protected readonly errnos = MetadataErrorNoCodes as (
        { [K in MetadataErrorCode]: typeof MetadataErrorNoCodes[K] }
    )
    protected readonly states = MetadataErrorStates
    protected readonly messages = MetadataErrorMessages

    constructor(code: MetadataErrorCode, ...args: any) {
        super(code, ...args)
    }
}

export {
    MetadataErrorCodes,
    type MetadataErrorCode,
}