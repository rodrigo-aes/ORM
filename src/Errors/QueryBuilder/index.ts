import PolyORMException from "../PolyORMException"

import util from 'util'

// Static
import {
    QueryBuilderErrorCodes,
    QueryBuilderErrorNoCodes,
    QueryBuiderErrorStates,
    QueryBuilderErrorMessages,

    type QueryBuilderErrorCode,
} from "./Static"

export default class QueryBuilderException extends PolyORMException<
    QueryBuilderErrorCode,
    { [K in QueryBuilderErrorCode]: typeof QueryBuilderErrorNoCodes[K] },
    typeof QueryBuiderErrorStates,
    typeof QueryBuilderErrorMessages
> {
    constructor(code: QueryBuilderErrorCode, ...args: any) {
        super(
            code,
            QueryBuilderErrorNoCodes,
            QueryBuiderErrorStates,
            QueryBuilderErrorMessages,
            ...args
        )
    }
}

export {
    QueryBuilderErrorCodes,
    type QueryBuilderErrorCode,
}