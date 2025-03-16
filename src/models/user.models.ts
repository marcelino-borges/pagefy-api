import { Schema, model } from "mongoose";

export interface UserOnboardings {
  userPages?: boolean;
  pageEditor?: {
    general?: boolean;
    createDialog?: boolean;
    createButton?: boolean;
  };
}

export interface IUser {
  _id?: string;
  authId?: string;
  paymentId?: string;
  profileImageUrl?: string;
  firstName: string;
  lastName: string;
  email: string;
  agreePrivacy: boolean;
  receiveCommunications: boolean;
  onboardings?: UserOnboardings;
}

const authSchema = new Schema<IUser>(
  {
    authId: { type: String },
    paymentId: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    profileImageUrl: { type: String },
    agreePrivacy: { type: Boolean, required: true },
    receiveCommunications: { type: Boolean, required: true },
    onboardings: {
      type: {
        userPages: { type: Boolean, required: false, default: false },
        pageEditor: {
          type: {
            general: { type: Boolean, required: false, default: false },
            createDialog: { type: Boolean, required: false, default: false },
            createButton: { type: Boolean, required: false, default: false },
          },
          required: false,
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>("Users", authSchema);
