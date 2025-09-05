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
exports.TransactionServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_model_1 = require("../user/user.model");
const wallet_model_1 = require("../wallet/wallet.model");
const user_interface_1 = require("../user/user.interface");
const transcation_interface_1 = require("./transcation.interface");
const transaction_model_1 = require("./transaction.model");
const agentCommissionCashIn = 2;
const agentCommissionCashOut = 3;
const superAdminCommission = 5;
const sendMoney = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Inappropriate amount");
    }
    amount = amount + superAdminCommission;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isSenderUserExist = yield user_model_1.User.findById(senderId);
        const isReceiverUserExist = yield user_model_1.User.findById(receiverId);
        if (!isSenderUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid user");
        }
        if (!isReceiverUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid  receiver");
        }
        const senderWallet = yield wallet_model_1.Wallet.findById(isSenderUserExist === null || isSenderUserExist === void 0 ? void 0 : isSenderUserExist.wallet);
        const receiverWallet = yield wallet_model_1.Wallet.findById(isReceiverUserExist.wallet);
        if (!(senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You don't have any balance left");
        }
        if ((senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.balance) < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You don't have enough money");
        }
        senderWallet.balance -= amount;
        yield (senderWallet === null || senderWallet === void 0 ? void 0 : senderWallet.save({ session }));
        if (receiverWallet) {
            receiverWallet.balance = receiverWallet.balance + (amount - superAdminCommission);
            yield (receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet.save({ session }));
        }
        const superAdmin = yield user_model_1.User.findOne({ role: user_interface_1.ROLE.SUPER_ADMIN });
        if (superAdmin) {
            superAdmin.adminCommission += superAdminCommission;
            yield superAdmin.save({ session });
        }
        const senderTxn = yield transaction_model_1.Transaction.create([
            {
                user: senderId,
                wallet: senderWallet._id,
                amount: -amount,
                status: transcation_interface_1.TRANSACTION_STATUS.COMPLETE,
            },
        ], { session });
        const receiverTxn = yield transaction_model_1.Transaction.create([
            {
                user: receiverId,
                wallet: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
                amount: amount - superAdminCommission,
                status: transcation_interface_1.TRANSACTION_STATUS.COMPLETE,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { senderTxn: senderTxn[0], receiverTxn: receiverTxn[0] };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashIn = (agentId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Inappropriate amount");
    }
    amount = amount + agentCommissionCashIn;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const agent = yield user_model_1.User.findById(agentId);
        const receiver = yield user_model_1.User.findById(receiverId);
        if (!agent) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent doesn't exists");
        }
        if (!receiver) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver doesn't exists");
        }
        if (agent.role !== user_interface_1.ROLE.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not and agent");
        }
        const agentWallet = yield wallet_model_1.Wallet.findById(agent.wallet);
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiver.wallet);
        if (!receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet does not exist");
        }
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent wallet does not exist");
        }
        if (!agentWallet.agentMoney) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent doesn't have any money");
        }
        if (agentWallet.agentMoney < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent wallet does not have enough");
        }
        receiverWallet.balance = receiverWallet.balance + (amount - agentCommissionCashIn);
        yield receiverWallet.save({ session });
        agentWallet.balance -= amount;
        agentWallet.agentCommission += agentCommissionCashIn;
        agentWallet.agentMoney -= amount;
        yield agentWallet.save({ session });
        const agentTxn = yield transaction_model_1.Transaction.create([
            {
                user: agentId,
                wallet: agentWallet._id,
                amount: -amount,
                status: transcation_interface_1.TRANSACTION_STATUS.COMPLETE,
            },
        ], { session });
        const receiverTxn = yield transaction_model_1.Transaction.create([
            {
                user: receiverId,
                wallet: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
                amount: amount - agentCommissionCashIn,
                status: transcation_interface_1.TRANSACTION_STATUS.COMPLETE,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { agentTxn: agentTxn[0], receiverTxn: receiverTxn[0] };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cashOut = (agentId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    if (amount <= 0) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Inappropriate amount");
    }
    amount = amount + agentCommissionCashOut;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const agent = yield user_model_1.User.findById(agentId);
        const receiver = yield user_model_1.User.findById(receiverId);
        if (!agent) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent doesn't exists");
        }
        if (!receiver) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver doesn't exists");
        }
        if (agent.role !== user_interface_1.ROLE.AGENT) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not and agent");
        }
        const agentWallet = yield wallet_model_1.Wallet.findById(agent.wallet);
        const receiverWallet = yield wallet_model_1.Wallet.findById(receiver.wallet);
        if (!receiverWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Receiver wallet does not exist");
        }
        if (!agentWallet) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Agent wallet does not exist");
        }
        if (receiverWallet.balance < amount) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Client wallet does not have enough money");
        }
        receiverWallet.balance -= amount;
        yield receiverWallet.save({ session });
        agentWallet.agentCommission += agentCommissionCashOut;
        yield agentWallet.save({ session });
        const agentTxn = yield transaction_model_1.Transaction.create([
            {
                user: agentId,
                wallet: agentWallet._id,
                amount: agentCommissionCashOut,
                status: transcation_interface_1.TRANSACTION_STATUS.COMPLETE,
            },
        ], { session });
        const receiverTxn = yield transaction_model_1.Transaction.create([
            {
                user: receiverId,
                wallet: receiverWallet === null || receiverWallet === void 0 ? void 0 : receiverWallet._id,
                amount: amount - agentCommissionCashOut,
                status: transcation_interface_1.TRANSACTION_STATUS.COMPLETE,
            },
        ], { session });
        yield session.commitTransaction();
        session.endSession();
        return { agentTxn: agentTxn[0], receiverTxn: receiverTxn[0] };
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getIndividualTransactionHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userTransaction = yield transaction_model_1.Transaction.find({ user: userId });
        console.log(userTransaction);
        const totalDocument = yield transaction_model_1.Transaction.find({ user: userId }).countDocuments();
        return {
            data: userTransaction,
            meta: {
                total: totalDocument
            }
        };
    }
    catch (error) {
        console.log(error);
    }
});
const getAllTransaction = () => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield transaction_model_1.Transaction.find({});
    const totalTransaction = yield transaction_model_1.Transaction.countDocuments();
    return {
        data: transaction,
        meta: {
            total: totalTransaction
        }
    };
});
exports.TransactionServices = {
    sendMoney, cashIn, cashOut, getAllTransaction, getIndividualTransactionHistory
};
