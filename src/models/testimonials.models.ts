import { model, Schema } from "mongoose";

export interface ITestimonial {
  _id?: string;
  userId: string;
  testimonial: string;
  pictureUrl: string;
  videoUrl: string;
  rating: number;
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
    pictureUrl: { type: String, required: true },
    videoUrl: { type: String },
    rating: { type: Number, required: true },
    createdAt: { type: Date },
    updateddAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default model<ITestimonial>("Testimonials", testimonialSchema);
