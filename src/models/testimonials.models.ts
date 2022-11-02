import { model, Schema } from "mongoose";

export interface ITestimonial {
  _id?: string;
  userId: string;
  testimonial: string;
  rating: number;
  pictureUrl?: string;
  videoUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    testimonial: { type: String, required: true },
    rating: { type: Number, required: true },
    pictureUrl: { type: String },
    videoUrl: { type: String },
    createdAt: { type: Date },
    updateddAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default model<ITestimonial>("Testimonials", testimonialSchema);
