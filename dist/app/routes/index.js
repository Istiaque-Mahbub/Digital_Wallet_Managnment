"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const users_routes_1 = require("../modules/user/users.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const transaction_routes_1 = require("../modules/transaction/transaction.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: users_routes_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes
    },
    {
        path: "/payment",
        route: payment_routes_1.PaymentRoutes
    },
    {
        path: "/transaction",
        route: transaction_routes_1.TransactionRouters
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
