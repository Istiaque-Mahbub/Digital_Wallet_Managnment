"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const mongoose_1 = require("mongoose");
const walletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 10 },
    currency: { type: String, default: "BDT" },
    agentMoney: { type: Number, default: 0 },
    agentCommission: { type: Number, default: 0 },
}, {
    versionKey: false,
    timestamps: true
});
exports.Wallet = (0, mongoose_1.model)("Wallet", walletSchema);
