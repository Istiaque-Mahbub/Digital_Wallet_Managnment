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
exports.PaymentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const payment_interface_1 = require("./payment.interface");
const payment_model_1 = require("./payment.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const wallet_model_1 = require("../wallet/wallet.model");
const initPayment = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findOne({ user: userId });
    if (!payment) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Payment information not found");
    }
    const user = yield user_model_1.User.findById(payment.user);
    const userEmail = user === null || user === void 0 ? void 0 : user.email;
    const userPhoneNumber = user === null || user === void 0 ? void 0 : user.phone;
    const userName = user === null || user === void 0 ? void 0 : user.name;
    const sslPayload = {
        email: userEmail,
        phoneNumber: userPhoneNumber,
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId
    };
    const sslPayment = yield (sslCommerz_service_1.SSLService === null || sslCommerz_service_1.SSLService === void 0 ? void 0 : sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload));
    return {
        paymentUrl: sslPayment.GatewayPageURL
    };
});
const successPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.PAID,
        }, { runValidators: true, session: session });
        const user = updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.user;
        const wallet = yield wallet_model_1.Wallet.findOne({ userId: user });
        yield user_model_1.User
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.user, { role: user_interface_1.ROLE.AGENT }, { runValidators: true, session });
        yield wallet_model_1.Wallet
            .findByIdAndUpdate(wallet, { $inc: { agentMoney: updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.amount } }, { runValidators: true, session });
        yield session.commitTransaction(); //transaction
        session.endSession();
        return { success: false, message: "Payment Successfully" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const failPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session });
        yield user_model_1.User
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.user, { role: user_interface_1.ROLE.USER }, { runValidators: true, session });
        yield session.commitTransaction(); //transaction
        session.endSession();
        return { success: false, message: "Payment Failed" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
const cancelPayment = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Update Booking Status to CANCEL
    // Update Payment Status to CANCEL
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const updatedPayment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: payment_interface_1.PAYMENT_STATUS.CANCELED,
        }, { runValidators: true, session: session });
        yield user_model_1.User
            .findByIdAndUpdate(updatedPayment === null || updatedPayment === void 0 ? void 0 : updatedPayment.user, { role: user_interface_1.ROLE.USER }, { runValidators: true, session });
        yield session.commitTransaction(); //transaction
        session.endSession();
        return { success: false, message: "Payment Cancelled" };
    }
    catch (error) {
        yield session.abortTransaction(); // rollback
        session.endSession();
        throw error;
    }
});
exports.PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    initPayment
};
