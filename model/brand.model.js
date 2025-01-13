import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
  {
    value: { type: String, required: true, unique: true },
    label: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const virtual = brandSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
brandSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
export const Brand = mongoose.model("Brand", brandSchema);
