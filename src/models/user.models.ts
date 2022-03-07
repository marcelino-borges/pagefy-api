import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
}

const authSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    profileImageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("Users", authSchema);
