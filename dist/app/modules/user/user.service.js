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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../../config/env");
const wallet_model_1 = require("../wallet/wallet.model");
const payment_model_1 = require("../payment/payment.model");
const payment_interface_1 = require("../payment/payment.interface");
const mongoose_1 = __importDefault(require("mongoose"));
const sslCommerz_service_1 = require("../../sslCommerz/sslCommerz.service");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const session = yield user_model_1.User.startSession();
    session.startTransaction();
    try {
        const isUserExist = yield user_model_1.User.findOne({ email });
        if (isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "User already exist ");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
        const user = yield user_model_1.User.create([Object.assign({ email, password: hashedPassword }, rest)], { session });
        const wallet = yield wallet_model_1.Wallet.create([{
                userId: (_a = user[0]) === null || _a === void 0 ? void 0 : _a._id,
            }], { session });
        const updatedUser = yield user_model_1.User
            .findByIdAndUpdate((_b = user[0]) === null || _b === void 0 ? void 0 : _b._id, { wallet: (_c = wallet[0]) === null || _c === void 0 ? void 0 : _c._id }, { new: true, runValidators: true, session })
            .populate("wallet");
        yield session.commitTransaction();
        session.endSession();
        return updatedUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const updateUser = (userId, payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield user_model_1.User.findById(userId);
    if (!isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    if (payload.email || payload.nidNumber || payload.phone) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You don't allow to change email,nidNumber,phone number");
        return;
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.ROLE.USER || decodedToken.role === user_interface_1.ROLE.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not allow to change role");
        }
        if (payload.role === user_interface_1.ROLE.SUPER_ADMIN && decodedToken.role === user_interface_1.ROLE.ADMIN) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not allow to change role");
        }
    }
    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === user_interface_1.ROLE.USER || decodedToken.role === user_interface_1.ROLE.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not allow to change role");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT_ROUND));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUser = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUser
        }
    };
});
const requestForAgent = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransactionId();
    const agentMoney = 10000;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isUserExist = yield user_model_1.User.findById(userId).session(session);
        if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.payment) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "You already requested for it once before");
        }
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role) === user_interface_1.ROLE.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "You are already an agent");
        }
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isActive) === user_interface_1.IS_ACTIVE.BLOCKED) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not active user");
        }
        if ((isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isActive) === user_interface_1.IS_ACTIVE.INACTIVE) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not active user");
        }
        if (isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not allowed");
        }
        const payment = yield payment_model_1.Payment.create([{
                user: userId,
                wallet: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.wallet,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId: transactionId,
                amount: agentMoney
            }], { session });
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, {
            payment: payment[0]._id
        }, { new: true, runValidators: true }).populate("payment");
        const userEmail = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email;
        const userPhone = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.phone;
        const username = isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.name;
        const sslPayload = {
            phoneNumber: userPhone,
            email: userEmail,
            amount: agentMoney,
            name: username,
            transactionId: transactionId
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            user: updatedUser,
            paymentUrl: sslPayment.GatewayPageURL
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const agentRequestAddMoney = (userId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = getTransactionId();
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId).session(session);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        if (user.role !== user_interface_1.ROLE.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Only agents can add money");
        }
        if (user.isActive === user_interface_1.IS_ACTIVE.BLOCKED ||
            user.isActive === user_interface_1.IS_ACTIVE.INACTIVE ||
            user.isDeleted) {
            throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not allowed");
        }
        // Check if user already has a pending (unpaid) payment
        const existingPending = yield payment_model_1.Payment.findOne({
            user: userId,
        }).session(session);
        if ((existingPending === null || existingPending === void 0 ? void 0 : existingPending.status) !== payment_interface_1.PAYMENT_STATUS.PAID) {
            throw new AppError_1.default(http_status_codes_1.default.CONFLICT, "You already have a pending payment request");
        }
        if (existingPending.status === payment_interface_1.PAYMENT_STATUS.PAID) {
            yield payment_model_1.Payment.findByIdAndDelete(existingPending._id).session(session);
        }
        const payment = yield payment_model_1.Payment.create([
            {
                user: userId,
                wallet: user.wallet,
                status: payment_interface_1.PAYMENT_STATUS.UNPAID,
                transactionId,
                amount,
            },
        ], { session });
        // Link latest payment to user
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { payment: payment[0]._id }, { new: true, runValidators: true, session }).populate("payment");
        //   const updatedWallet = await Wallet.findByIdAndUpdate(
        //     payment[0].wallet,
        //     { $inc: { agentMoney: payment[0].amount } },
        //     { new: true, runValidators: true, session }
        //   ).populate("payment");
        // Prepare SSL request
        const sslPayload = {
            phoneNumber: user.phone,
            email: user.email,
            amount,
            name: user.name,
            transactionId,
        };
        const sslPayment = yield sslCommerz_service_1.SSLService.sslPaymentInit(sslPayload);
        yield session.commitTransaction();
        session.endSession();
        return {
            user: updatedUser,
            paymentUrl: sslPayment.GatewayPageURL,
        };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.UserServices = {
    createUser, getAllUsers, updateUser, requestForAgent, agentRequestAddMoney
};
