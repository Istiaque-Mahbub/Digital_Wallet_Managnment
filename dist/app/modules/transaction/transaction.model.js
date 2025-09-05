"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transcation_interface_1 = require("./transcation.interface");
const transactionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
        required: true,
    },
    wallet: {
        type: mongoose_1.Types.ObjectId,
        ref: "Wallet",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(transcation_interface_1.TRANSACTION_STATUS),
        default: transcation_interface_1.TRANSACTION_STATUS.PENDING,
    },
}, { timestamps: true,
    versionKey: false
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
