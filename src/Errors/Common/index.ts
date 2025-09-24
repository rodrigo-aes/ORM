import PolyORMException from "../PolyORMException"

// Static
import {
    CommonErrorCodes,
    CommonErrorNoCodes,
    CommonErrorStates,
    CommonErrorMessages,

    type CommonErrorCode,
} from "./Static"


export default class CommonException extends PolyORMException<
    CommonErrorCode,
    { [K in CommonErrorCode]: typeof CommonErrorNoCodes[K] },
    typeof CommonErrorStates,
    typeof CommonErrorMessages
> {
    protected readonly errnos = CommonErrorNoCodes as (
        { [K in CommonErrorCode]: typeof CommonErrorNoCodes[K] }
    )
    protected readonly states = CommonErrorStates
    protected readonly messages = CommonErrorMessages

    constructor(code: CommonErrorCode, ...args: any) {
        super(code, ...args)
    }
}

export {
    CommonErrorCodes,
    type CommonErrorCode,
}