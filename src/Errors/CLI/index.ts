import PolyORMException from "../PolyORMException"

// Static
import {
    CLIErrorCodes,
    CLIErrorNoCodes,
    CLIErrorStates,
    CLIErrorMessages,

    type CLIErrorCode
} from "./Static"

export default class CLIException extends PolyORMException<
    CLIErrorCode,
    { [K in CLIErrorCode]: typeof CLIErrorNoCodes[K] },
    typeof CLIErrorStates,
    typeof CLIErrorMessages
> {

    constructor(code: CLIErrorCode, ...args: any) {
        super(code, CLIErrorNoCodes, CLIErrorStates, CLIErrorMessages, ...args)
    }
}

export {
    CLIErrorCodes,
    type CLIErrorCode,
}