import { model, Schema } from "mongoose";

export interface IFaq {
  _id?: string;
  question: string;
  answer: string;
  locale: string;
  createdAt?: string;
  updatedAt?: string;
}

const faqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    locale: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model<IFaq>("faq", faqSchema);
