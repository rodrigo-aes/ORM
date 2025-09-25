import PolyORMException from "../PolyORMException"

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
    protected readonly errnos = QueryBuilderErrorNoCodes as (
        { [K in QueryBuilderErrorCode]: typeof QueryBuilderErrorNoCodes[K] }
    )
    protected readonly states = QueryBuiderErrorStates
    protected readonly messages = QueryBuilderErrorMessages

    constructor(code: QueryBuilderErrorCode, ...args: any) {
        super(code, ...args)
    }
}

export {
    QueryBuilderErrorCodes,
    type QueryBuilderErrorCode,
}