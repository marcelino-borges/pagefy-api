import { Schema, model } from "mongoose";

import { IUser } from "./user.models";

export interface ITestimonial {
  _id?: string;
  user: Partial<IUser> | string;
  testimonial: string;
  rating: number;
  pictureUrl?: string;
  videoUrl?: string;
  language?: string;
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
    language: { type: String },
    videoUrl: { type: String },
    createdAt: { type: Date },
    updateddAt: { type: Date },
  },
  {
    timestamps: true,
  },
);

export default model<ITestimonial>("Testimonials", testimonialSchema);
