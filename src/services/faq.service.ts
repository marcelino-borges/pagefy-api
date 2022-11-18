import FaqDB, { IFaq } from "../models/faq.models";

export const createFaq = async (faq: IFaq): Promise<IFaq | null> => {
  const faqCreated = (await FaqDB.create(faq)).toObject();

  if (!faqCreated) {
    return null;
  }

  return faqCreated;
};

export const updateFaq = async (faq: Partial<IFaq>): Promise<IFaq | null> => {
  const updatedFaq = await FaqDB.findOneAndUpdate(
    { _id: faq._id },
    { ...faq },
    { new: true }
  ).lean();

  if (!updatedFaq) {
    return null;
  }

  return updatedFaq;
};

export const deleteFaq = async (faqId: string): Promise<IFaq | null> => {
  const deletedFaq = await FaqDB.findOneAndDelete({
    _id: faqId,
  }).lean();

  if (!deletedFaq) {
    return null;
  }

  return deletedFaq;
};

export const getAllFaqs = async (query: {
  language?: string;
}): Promise<IFaq[] | null> => {
  const faqs = await FaqDB.find({ language: query.language }).lean();

  if (!faqs) {
    return null;
  }

  return faqs;
};
