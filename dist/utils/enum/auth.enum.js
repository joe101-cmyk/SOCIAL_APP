export var GenderEnum;
(function (GenderEnum) {
    GenderEnum["MALE"] = "MALE";
    GenderEnum["FEMALE"] = "FEMElE";
})(GenderEnum || (GenderEnum = {}));
export var RoleEnum;
(function (RoleEnum) {
    RoleEnum["ADMIN"] = "ADMIN";
    RoleEnum["USER"] = "USER";
})(RoleEnum || (RoleEnum = {}));
export var signtureEnum;
(function (signtureEnum) {
    signtureEnum[signtureEnum["USER"] = 0] = "USER";
    signtureEnum[signtureEnum["ADMIN"] = 1] = "ADMIN";
})(signtureEnum || (signtureEnum = {}));
export var TokenTypeEnum;
(function (TokenTypeEnum) {
    TokenTypeEnum["Access"] = "Access";
    TokenTypeEnum["Refresh"] = "Refresh";
})(TokenTypeEnum || (TokenTypeEnum = {}));
export var Logout;
(function (Logout) {
    Logout["LOGOUT"] = "LOGOUT";
    Logout["LOGOUT_FROM_ALL"] = "LOGOUT_FROM_ALL";
})(Logout || (Logout = {}));
