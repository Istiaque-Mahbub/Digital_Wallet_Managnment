"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const env_1 = require("../../config/env");
const jwt_1 = require("../../utils/jwt");
const transaction_services_1 = require("./transaction.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const sendMoney = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const token = req.headers.authorization;
    const receiverId = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.receiverId;
    const amount = Number((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.amount);
    const verifiedToken = (0, jwt_1.verifyToken)(token, env_1.envVars.JWT_ACCESS_SECRET);
    const decodedToken = req.user;
    const senderId = decodedToken.userId;
    const result = yield transaction_services_1.TransactionServices.sendMoney(senderId, receiverId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Money send successfully",
        data: result
    });
});
const cashIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const agentId = decodedToken.userId;
    const receiverId = req.body.receiverId;
    const amount = Number(req.body.amount);
    const result = yield transaction_services_1.TransactionServices.cashIn(agentId, receiverId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Cash In successfully",
        data: result
    });
});
const cashOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const agentId = decodedToken.userId;
    const receiverId = req.body.receiverId;
    const amount = Number(req.body.amount);
    const result = yield transaction_services_1.TransactionServices.cashOut(agentId, receiverId, amount);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Cash Out successfully",
        data: result
    });
});
const getIndividualTransactionHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const result = yield transaction_services_1.TransactionServices.getIndividualTransactionHistory(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Your transaction retrieved successfully",
        data: result
    });
});
const getAllTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transaction_services_1.TransactionServices.getAllTransaction();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All transaction retrieved successfully",
        data: result
    });
});
exports.TransactionController = {
    sendMoney, cashIn, cashOut, getAllTransaction, getIndividualTransactionHistory
};
