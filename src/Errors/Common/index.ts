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
    constructor(code: CommonErrorCode, ...args: any) {
        super(
            code,
            CommonErrorNoCodes,
            CommonErrorStates,
            CommonErrorMessages,
            ...args
        )
    }
}

export {
    CommonErrorCodes,
    type CommonErrorCode,
}