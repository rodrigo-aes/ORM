import * as Op from './Symbols'

import EqualOperator from "./Equal"
import NotEqualOperator from "./NotEqual"
import OrOperator from './Or'
import LowerThanOperator from "./LowerThan"
import LowerThanEqualOperator from "./LowerThanEqual"
import GreaterThanOpertor from "./GreaterThan"
import GreaterThanEqualOpertor from "./GreaterThanEqual"
import BetweenOperator from "./Between"
import NotBetweenOperator from "./NotBetween"
import InOperator from "./In"
import NotInOperator from "./NotIn"
import LikeOperator from "./Like"
import NotLikeOperator from "./NotLike"
import NullOperator from "./Null"
import NotNullOperator from "./NotNull"
import RegExpOperator from "./RegExp"
import NotRegExpOperator from "./NotRegExp"

// Types
import type {
    OperatorKey,
    OperatorType,
    CompatibleOperators,
} from './types'

export default abstract class Operator {
    public static [Op.Equal] = EqualOperator
    public static [Op.NotEqual] = NotEqualOperator
    public static [Op.Or] = OrOperator
    public static [Op.LT] = LowerThanOperator
    public static [Op.LTE] = LowerThanEqualOperator
    public static [Op.GT] = GreaterThanOpertor
    public static [Op.GTE] = GreaterThanEqualOpertor
    public static [Op.Between] = BetweenOperator
    public static [Op.NotBetween] = NotBetweenOperator
    public static [Op.In] = InOperator
    public static [Op.NotIn] = NotInOperator
    public static [Op.Like] = LikeOperator
    public static [Op.NotLike] = NotLikeOperator
    public static [Op.Null] = NullOperator
    public static [Op.NotNull] = NotNullOperator
    public static [Op.RegExp] = RegExpOperator
    public static [Op.NotRegExp] = NotRegExpOperator

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static isOperator(key: any): boolean {
        return Object.values(Op).includes(key)
    }

    // ------------------------------------------------------------------------

    public static hasOperator(object: any): boolean {
        return Object.getOwnPropertySymbols(object).some(
            key => this.isOperator(key)
        )
    }
}

export {
    Op,

    type OperatorKey,
    type OperatorType,
    type CompatibleOperators,
}