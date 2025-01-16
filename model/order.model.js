import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  items: { type: [Schema.Types.Mixed], required: true },
  totalAmount: { type: Number, min: 0 },
  totalItem: { type: Number, min: 0 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  //TODO:  we can add enum types
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "pending" },
  shippingAddress: { type: Schema.Types.Mixed, required: true },
});
const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
export const Order = mongoose.model("Order", orderSchema);
