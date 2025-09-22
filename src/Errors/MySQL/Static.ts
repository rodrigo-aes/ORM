export enum MySQLErrorCodes {
    TO_MANY_CONNECTIONS = 'ER_TOO_MANY_CONNECTIONS',
    ACCESS_DENIED = 'ER_ACCESS_DENIED_ERROR',

    DATABASE_ALREADY_EXISTS = 'ER_DB_CREATE_EXISTS',
    UNKNOWN_DATABASE = 'ER_NO_SUCH_DB',
    CANT_DROP_DATABASE = 'ER_CANT_DROP_DB',

    TABLE_ALREADY_EXISTS = 'ER_TABLE_EXISTS_ERROR',
    UNKNOWN_TABLE = 'ER_BAD_TABLE_ERROR',

    COLUMN_AMBIGUOUS = 'ER_NON_UNIQ_ERROR',
    UNKNOW_COLUMN = 'ER_BAD_FIELD_ERROR',
    COLUMN_NOT_FOUND = 'ER_COLUMN_NOT_FOUND_IN_INDEX',
    TO_LONG_COLUMN_NAME = 'ER_TOO_LONG_IDENT',
    DUPLICATE_COLUMN = 'ER_DUP_FIELDNAME',
    DUPLICATE_KEY = 'ER_DUP_KEYNAME',
    DUPLICATE_ENTRY = 'ER_DUP_ENTRY',

    SQL_SINTAX = 'ER_PARSE_ERROR',

    WRONG_COLUMN_WITH_GROUP = 'ER_WRONG_FIELD_WITH_GROUP',
    WRONG_GROUP_COLUMN = 'ER_WRONG_GROUP_FIELD',
    WRONG_SUM_SELECT = 'ER_WRONG_SUM_SELECT',

    FOREIGN_KEY_UPDATE = 'ER_FOREIGN_KEY_CONSTRAINT_FAILS',
    FOREIGN_KEY_REFERENCED = 'ER_ROW_IS_REFERENCED',

    WRONG_VALUE_NUMBER = 'ER_WRONG_VALUE_COUNT',
    WRONG_VALUE_NUMBER_ON_ROW = 'ER_WRONG_VALUE_COUNT_ON_ROW',
    OUT_OF_RANGE_VALUE = 'ER_WARN_DATA_OUT_OF_RANGE',
    TRUNCATE_VALUE = 'ER_WARN_DATA_TRUNCATED',
    TO_LONG_VALUE = 'ER_DATA_TOO_LONG',
    INCORRECT_VALUE = 'ER_TRUNCATED_WRONG_VALUE',
    INCORRECT_VALUE_FOR_COLUMN = 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD',
}

// ----------------------------------------------------------------------------

export enum MySQLErrorNoCodes {
    TO_MANY_CONNECTIONS = 1040,
    ACCESS_DENIED = 1045,

    DATABASE_ALREADY_EXISTS = 1007,
    UNKNOWN_DATABASE = 1049,
    CANT_DROP_DATABASE = 1008,

    TABLE_ALREADY_EXISTS = 1050,
    UNKNOWN_TABLE = 1051,

    COLUMN_AMBIGUOUS = 1052,
    UNKNOW_COLUMN = 1054,
    COLUMN_NOT_FOUND = 1166,
    TO_LONG_COLUMN_NAME = 1059,
    DUPLICATE_COLUMN = 1060,
    DUPLICATE_KEY = 1061,
    DUPLICATE_ENTRY = 1062,

    SQL_SINTAX = 1064,

    WRONG_COLUMN_WITH_GROUP = 1055,
    WRONG_GROUP_COLUMN = 1056,
    WRONG_SUM_SELECT = 1057,

    FOREIGN_KEY_UPDATE = 1216,
    FOREIGN_KEY_REFERENCED = 1217,

    WRONG_VALUE_NUMBER = 1058,
    WRONG_VALUE_NUMBER_ON_ROW = 1136,
    OUT_OF_RANGE_VALUE = 1264,
    TRUNCATE_VALUE = 1265,
    TO_LONG_VALUE = 1406,
    INCORRECT_VALUE = 1292,
    INCORRECT_VALUE_FOR_COLUMN = 1366,
}

// ----------------------------------------------------------------------------

export enum MySQLErrorStates {
    TO_MANY_CONNECTIONS = '08004',
    ACCESS_DENIED = '28000',

    DATABASE_ALREADY_EXISTS = 'HY000',
    UNKNOWN_DATABASE = '42000',
    CANT_DROP_DATABASE = 'HY000',

    TABLE_ALREADY_EXISTS = '42S01',
    UNKNOWN_TABLE = '42S02',

    COLUMN_AMBIGUOUS = '23000',
    UNKNOW_COLUMN = '42S22',
    COLUMN_NOT_FOUND = 'HY000',
    TO_LONG_COLUMN_NAME = '42000',
    DUPLICATE_COLUMN = '42S21',
    DUPLICATE_KEY = '42000',
    DUPLICATE_ENTRY = '23000',

    SQL_SINTAX = '42000',

    WRONG_COLUMN_WITH_GROUP = '42000',
    WRONG_GROUP_COLUMN = '42000',
    WRONG_SUM_SELECT = '42000',

    FOREIGN_KEY_UPDATE = '23000',
    FOREIGN_KEY_REFERENCED = '23000',

    WRONG_VALUE_NUMBER = '21S01',
    WRONG_VALUE_NUMBER_ON_ROW = '21S01',
    OUT_OF_RANGE_VALUE = '01000',
    TRUNCATE_VALUE = '01000',
    TO_LONG_VALUE = '22001',
    INCORRECT_VALUE = '22007',
    INCORRECT_VALUE_FOR_COLUMN = '22007',
}

// ----------------------------------------------------------------------------

export enum MySQLErrorMessages {
    TO_MANY_CONNECTIONS = 'Too many connections',
    ACCESS_DENIED = 'Access denied for user "%s"@"%s" (using password: %s)',

    DATABASE_ALREADY_EXISTS = `Can't create database "%s"; database exists`,
    UNKNOWN_DATABASE = 'Unknown database "%s"',
    CANT_DROP_DATABASE = `Can't drop database "%s"; database doesn't exist`,

    TABLE_ALREADY_EXISTS = 'Table "%s" already exists',
    UNKNOWN_TABLE = 'Unknown table "%s"',

    COLUMN_AMBIGUOUS = 'Column "%s" in %s is ambiguous',
    UNKNOW_COLUMN = 'Unknown column "%s" in "%s"',
    COLUMN_NOT_FOUND = 'Incorrect column name "%s"',
    TO_LONG_COLUMN_NAME = 'Identifier name "%s" is too long',
    DUPLICATE_COLUMN = 'Duplicate column name "%s"',
    DUPLICATE_KEY = 'Duplicate key name "%s"',
    DUPLICATE_ENTRY = 'Duplicate entry "%s" for key %d',

    SQL_SINTAX = 'You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near "%s" at line %d',

    WRONG_COLUMN_WITH_GROUP = `'%s' isn't in GROUP BY`,
    WRONG_GROUP_COLUMN = `Can't group on '%s'`,
    WRONG_SUM_SELECT = 'Statement has sum functions and columns in same statement',

    FOREIGN_KEY_UPDATE = 'Cannot add or update a child row: a foreign key constraint fails',
    FOREIGN_KEY_REFERENCED = 'Cannot delete or update a parent row: a foreign key constraint fails',

    WRONG_VALUE_NUMBER = `Column count doesn't match value count`,
    WRONG_VALUE_NUMBER_ON_ROW = `Column count doesn't match value count at row %ld`,
    OUT_OF_RANGE_VALUE = 'Out of range value for column "%s" at row %ld',
    TRUNCATE_VALUE = 'Data truncated for column "%s" at row %ld',
    TO_LONG_VALUE = 'ER_DATA_TOO_Data too long for column "%s" at row %ldLONG',
    INCORRECT_VALUE = 'Incorrect %s value: "%s"',
    INCORRECT_VALUE_FOR_COLUMN = 'Incorrect %s value: "%s" for column "%s" at row %ld',
}

export type PolyORMMySQLErrorCode = keyof typeof MySQLErrorCodes
export type MySQLErrorCode = `${MySQLErrorCodes}`