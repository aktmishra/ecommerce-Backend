import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    fullName: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: Buffer, required: true },
    salt: {type:Buffer},
    role: { type: String, required: true, default: "user" },
    addresses: { type: [Schema.Types.Mixed] },
    // TODO:  We can make a separate Schema for this
    name: { type: String },
    addresses: { type: [Schema.Types.Mixed] },
  },
  { timestamps: true }
);

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id;
});
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
export const User = mongoose.model("User", userSchema);
