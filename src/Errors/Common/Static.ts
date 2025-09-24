export enum CommonErrorCodes {
    NOT_INSTANTIABLE_CLASS = 'NOT_INSTANTIABLE_CLASS',
    NOT_CALLABLE_METHOD = 'NOT_CALLABLE_METHOD',


}

export enum CommonErrorNoCodes {
    NOT_INSTANTIABLE_CLASS = 1001,
    NOT_CALLABLE_METHOD = 1002
}

export enum CommonErrorStates {
    NOT_INSTANTIABLE_CLASS = 'ERR01',
    NOT_CALLABLE_METHOD = 'ERR02'
}

export enum CommonErrorMessages {
    NOT_INSTANTIABLE_CLASS = 'Class %s is not instantiable',
    NOT_CALLABLE_METHOD = 'Method "%s" is not calable in class %s'
}

export type CommonErrorCode = keyof typeof CommonErrorCodes