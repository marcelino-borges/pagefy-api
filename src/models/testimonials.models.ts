import { model, Schema } from "mongoose";
import { IUser } from "./user.models";

export interface ITestimonial {
  _id?: string;
  user: Partial<IUser> | string;
  testimonial: string;
  rating: number;
  pictureUrl?: string;
  videoUrl?: string;
  locale?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    testimonial: { type: String, required: true },
    rating: { type: Number, required: true },
    pictureUrl: { type: String },
    locale: { type: String },
    videoUrl: { type: String },
    createdAt: { type: Date },
    updateddAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default model<ITestimonial>("Testimonials", testimonialSchema);
