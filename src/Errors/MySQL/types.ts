export type PolyORMMySQLExceptionBuildTuple = (
    [string | undefined, (string | number)[]]
)

export type PolyORMMySQLExceptionsArgs = (
    [Error] | PolyORMMySQLExceptionBuildTuple
)