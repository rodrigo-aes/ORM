import type {
    PolyORMErrorCode,
    AcknowledgedErrorOrigin,
    AcknowledgedErrorTuple
} from "../../types"

export default class AcknowledgedExceptionHandler {
    public static handle(error: any): AcknowledgedErrorTuple {
        return [this.handleOrigin(error), error]
    }

    // ------------------------------------------------------------------------

    public static handleOrigin(error: any): (
        AcknowledgedErrorOrigin
    ) {
        switch (error.code as PolyORMErrorCode) {
            case "ER_TABLE_EXISTS_ERROR":
            case "ER_BAD_TABLE_ERROR": return 'MySQL'

            default: throw Error
        }
    }
}