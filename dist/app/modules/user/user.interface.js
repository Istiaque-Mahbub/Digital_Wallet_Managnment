"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IS_ACTIVE = exports.ROLE = void 0;
var ROLE;
(function (ROLE) {
    ROLE["SUPER_ADMIN"] = "SUPER_ADMIN";
    ROLE["ADMIN"] = "ADMIN";
    ROLE["USER"] = "USER";
    ROLE["AGENT"] = "AGENT";
})(ROLE || (exports.ROLE = ROLE = {}));
var IS_ACTIVE;
(function (IS_ACTIVE) {
    IS_ACTIVE["ACTIVE"] = "ACTIVE";
    IS_ACTIVE["INACTIVE"] = "INACTIVE";
    IS_ACTIVE["BLOCKED"] = "BLOCKED";
})(IS_ACTIVE || (exports.IS_ACTIVE = IS_ACTIVE = {}));
