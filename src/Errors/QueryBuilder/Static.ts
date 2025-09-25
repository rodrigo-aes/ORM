export enum QueryBuilderErrorCodes {
    MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS = 'MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS',
    EMPTY_AND_CLAUSE = 'EMPTY_AND_CLAUSE',
    MISSING_AS_ALIAS_ON_CLAUSE = 'MISSING_AS_ALIAS_ON_CLAUSE'
}

export enum QueryBuilderErrorNoCodes {
    MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS = 4001,
    EMPTY_AND_CLAUSE = 4604,
    MISSING_AS_ALIAS_ON_CLAUSE = 4701
}

export enum QueryBuiderErrorStates {
    MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS = 'QB-01',
    EMPTY_AND_CLAUSE = 'QBCOND-04',
    MISSING_AS_ALIAS_ON_CLAUSE = 'QBAS-01'
}

export enum QueryBuilderErrorMessages {
    MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS = 'Attempted to execute operation %s on incompatible clause "%s"',
    EMPTY_AND_CLAUSE = 'Empty and clause on conditional query builder options',
    MISSING_AS_ALIAS_ON_CLAUSE = 'Missin AS alias on %s clause'
}

export type QueryBuilderErrorCode = keyof typeof QueryBuilderErrorCodes