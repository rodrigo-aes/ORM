import PolyORMMySQLException from "../../MySQL"
import type {
    AcknowledgedErrorOrigin,
    AcknowledgedErrorTuple
} from "../../types"

export default class AcknowledgedExceptionHandler {
    public static handle(error: any): AcknowledgedErrorTuple {
        return [
            this.handleOrigin(error),
            PolyORMMySQLException.instantiate(
                PolyORMMySQLException.convertCode(error.code),
                undefined,
                error
            )
        ]
    }

    // ------------------------------------------------------------------------

    public static handleOrigin(error: any): AcknowledgedErrorOrigin {
        switch (true) {
            case PolyORMMySQLException.isMySQLError(error.code): return 'MySQL'

            default: throw error
        }
    }
}