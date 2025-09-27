// Exceptions
// - MySQL
import PolyORMMySQLException, {
    type PolyORMMySQLErrorCode
} from './MySQL'

// - Common
import CommonException, {
    CommonErrorCodes,
    type CommonErrorCode
} from './Common'

// - Metadata
import MetadataException, {
    MetadataErrorCodes,
    type MetadataErrorCode
} from './Metadata'

// - Query Builder
import QueryBuilderException, {
    QueryBuilderErrorCodes,
    type QueryBuilderErrorCode
} from './QueryBuilder'

// - CLI
import CLIException, {
    CLIErrorCodes,
    type CLIErrorCode
} from './CLI'

// Handlers
import { AcknowledgedExceptionHandler } from "./Handlers"

// Types
import type { AcknowledgedErrorTuple } from "./types"


export default class PolyORMException {
    private constructor() {
        CommonException.throw('NOT_INSTANTIABLE_CLASS', this.constructor.name)
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get MySQL(): typeof PolyORMMySQLException {
        return PolyORMMySQLException
    }

    // ------------------------------------------------------------------------

    public static get Common(): typeof CommonException {
        return CommonException
    }

    // ------------------------------------------------------------------------

    public static get Metadata(): typeof MetadataException {
        return MetadataException
    }

    // ------------------------------------------------------------------------

    public static get QueryBuilder(): typeof QueryBuilderException {
        return QueryBuilderException
    }

    // ------------------------------------------------------------------------

    public static get CLI(): typeof CLIException {
        return CLIException
    }
}

export {
    PolyORMMySQLException,
    AcknowledgedExceptionHandler,

    CommonErrorCodes,
    MetadataErrorCodes,
    QueryBuilderErrorCodes,
    CLIErrorCodes,

    type AcknowledgedErrorTuple,
    type PolyORMMySQLErrorCode,
    type CommonErrorCode,
    type MetadataErrorCode,
    type QueryBuilderErrorCode,
    type CLIErrorCode,
}