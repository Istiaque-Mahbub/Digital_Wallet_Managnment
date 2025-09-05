"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interface_1 = require("./payment.interface");
const paymentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    wallet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
        unique: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: Object.values(payment_interface_1.PAYMENT_STATUS),
        default: payment_interface_1.PAYMENT_STATUS.UNPAID
    },
    amount: {
        type: Number,
        required: true
    },
    paymentGateWayData: {
        type: mongoose_1.Schema.Types.Mixed
    },
    invoiceUrl: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
