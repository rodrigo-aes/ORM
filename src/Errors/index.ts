// Exceptions
// - MySQL
import PolyORMMySQLException, {
    type PolyORMMySQLErrorCode
} from './MySQL'

// - Common
import CommonException, { type CommonErrorCode } from './Common'

// - Metadata
import MetadataException, { type MetadataErrorCode } from './Metadata'

// - Query Builder
import QueryBuilderException from './QueryBuilder'

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

    public static get QueryBuilder(): typeof QueryBuilderException {
        return QueryBuilderException
    }

}

export {
    PolyORMMySQLException,
    AcknowledgedExceptionHandler,
    PolyORMMySQLErrorCode,

    type AcknowledgedErrorTuple,
    type MetadataErrorCode
}