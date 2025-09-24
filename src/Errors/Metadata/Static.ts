export enum MetadataErrorCodes {
    INEXISTENT_CONNECTION = 'INEXISTENT_CONNECTION',
    MISSING_ENTITY_CONNECTION = 'MISSING_ENTITY_CONNECTION',

    INVALID_ENTITY = 'INVALID_ENTITY',
    UNKNOWN_ENTITY = 'UNKNOWN_ENTITY',
    INVALID_POLYMORPHIC_SOURCE = 'INVALID_POLYMORPHIC_SOURCE',
    INVALID_INCLUDED_VALUE = 'INVALID_INCLUDED_VALUE',

    INVALID_RELATION = 'INVALID_RELATION',
    UNKNOWN_RELATION = 'UNKNOWN_RELATION',

    UNKNOWN_SCOPE = 'UNKNOWN_SCOPE',

    UNKNOWN_COLLECTION = 'UNKNOWN_COLLECTION',

    INVALID_GENERATED_COLUMN_DATATYPE = 'INVALID_GENERATED_COLUMN_DATATYPE',
    IMCOMPATIBLE_POLYMORPHIC_COLUMN_DATATYPES = (
        'IMCOMPATIBLE_POLYMORPHIC_COLUMN_DATATYPES'
    ),
    IMCOMPATIBLE_POLYMORPHIC_RELATIONS = 'IMCOMPATIBLE_POLYMORPHIC_RELATIONS'
}

export enum MetadataErrorNoCodes {
    INEXISTENT_CONNECTION = 1001,
    MISSING_ENTITY_CONNECTION = 1002,

    INVALID_ENTITY = 2001,
    UNKNOWN_ENTITY = 2002,
    INVALID_POLYMORPHIC_SOURCE = 2003,
    INVALID_INCLUDED_VALUE = 2008,

    INVALID_RELATION = 3201,
    UNKNOWN_RELATION = 2302,

    INVALID_REPOSITORY = 2501,

    UNKNOWN_SCOPE = 2602,

    UNKNOWN_COLLECTION = 3002,

    UNKNOWN_PAGINATION = 3102,

    INVALID_GENERATED_COLUMN_DATATYPE = 3204,

    IMCOMPATIBLE_POLYMORPHIC_COLUMN_DATATYPES = 3306,
    IMCOMPATIBLE_POLYMORPHIC_RELATIONS = 3406
}

export enum MetadataErrorStates {
    INEXISTENT_CONNECTION = 'CONN-01',
    MISSING_ENTITY_CONNECTION = 'CONN-02',

    INVALID_ENTITY = 'META-01',
    UNKNOWN_ENTITY = 'META-02',
    INVALID_POLYMORPHIC_SOURCE = 'META-03',
    INVALID_INCLUDED_VALUE = 'META-08',

    INVALID_RELATION = 'RELMETA-01',
    UNKNOWN_RELATION = 'RELMETA-02',

    INVALID_REPOSITORY = 'REPMETA-01',

    UNKNOWN_SCOPE = 'SCOMETA-02',

    UNKNOWN_COLLECTION = 'CLCMETA-02',

    UNKNOWN_PAGINATION = 'PAGMETA-02',

    INVALID_GENERATED_COLUMN_DATATYPE = 'DT-04',

    IMCOMPATIBLE_POLYMORPHIC_COLUMN_DATATYPES = 'PDT-06',
    IMCOMPATIBLE_POLYMORPHIC_RELATIONS = 'PRLMETA-06'
}

export enum MetadataErrorMessages {
    INEXISTENT_CONNECTION = 'inexistent connection metadata referenced by name "%s"',
    MISSING_ENTITY_CONNECTION = 'Missing connection metadata for "%s" entity class. Entities should be registered on a connection instance',

    INVALID_ENTITY = 'Invalid entity target class "%s". Entities should be extends BaseEntity or BasePolymorphicEntity classes',
    UNKNOWN_ENTITY = 'Missing entity metadata register for class "%s". Entity classes should be declarared with @Entity or @PolymorphicEntity decorators',
    INVALID_POLYMORPHIC_SOURCE = 'Invalid operation source entity "%s" for polymorphic entity class %s',
    INVALID_INCLUDED_VALUE = 'Invalid value "%s" of type "%s" in %s entity class included properties/getters',

    INVALID_RELATION = 'Invalid relation type "%s" for relation "%s" of type "%s"',
    UNKNOWN_RELATION = 'Missing "%s" relation metadata register for entity %s',

    INVALID_REPOSITORY = 'Invalid repository class "%s". Repositories should be extends Repository or PolymorphicRepository classes',

    UNKNOWN_SCOPE = 'Missing "%s" scope metadata register for entity %s',

    UNKNOWN_COLLECTION = 'Missing "%s" collection metadata register for entity %s',

    UNKNOWN_PAGINATION = 'Missing "%s" pagination metadata register for entity %s',

    INVALID_GENERATED_COLUMN_DATATYPE = '%s DataType is invalid for %s GENERATED column',

    IMCOMPATIBLE_POLYMORPHIC_COLUMN_DATATYPES = 'Imcompatible DataTypes (%s) for polymorphic entity class %s column "%s"',
    IMCOMPATIBLE_POLYMORPHIC_RELATIONS = 'Imcompatible relations types (%s) with the same name "%s" for polymorphic entity class %s'
}

export type MetadataErrorCode = keyof typeof MetadataErrorCodes