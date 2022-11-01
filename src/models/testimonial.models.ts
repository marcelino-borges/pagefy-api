import { model, Schema } from "mongoose";

export interface ITestimonial {
  _id?: string;
  userId: string;
  testimonial: string;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
}
