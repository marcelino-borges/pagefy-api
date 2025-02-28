import TestimonialDB, { ITestimonial } from "../models/testimonials.models";

export const createTestimonial = async (testimonial: ITestimonial) => {
  const testimonialCreated = (
    await TestimonialDB.create(testimonial)
  ).toObject();

  if (!testimonialCreated) {
    return null;
  }

  return testimonialCreated;
};

export const getUserTestimonials = async (
  userId: string,
): Promise<ITestimonial[] | null> => {
  const testimonials = await TestimonialDB.find({ user: userId })
    .populate(
      "user",
      "-authId -paymentId -agreePrivacy -receiveCommunications -plan",
    )
    .sort({
      createdAt: "desc",
    })
    .lean();

  if (!testimonials) {
    return null;
  }

  return testimonials;
};

export const getUserLastTestimonial = async (userId: string) => {
  const testimonial = await getUserTestimonials(userId);

  if (!testimonial) {
    return null;
  }

  return testimonial[0];
};

export const updateUserTestimonial = async (
  testimonial: ITestimonial,
): Promise<ITestimonial | null> => {
  const updatedTestimonial = await TestimonialDB.findOneAndUpdate(
    { _id: testimonial._id },
    { ...testimonial },
    { new: true },
  ).lean();

  if (!updatedTestimonial) {
    return null;
  }

  return updatedTestimonial;
};

export const deleteUserTestimonial = async (
  testimonialId: string,
): Promise<ITestimonial | null> => {
  const deletedTestimonial = await TestimonialDB.findOneAndDelete({
    _id: testimonialId,
  }).lean();

  if (!deletedTestimonial) {
    return null;
  }

  return deletedTestimonial;
};

export const queryTestimonials = async (query: {
  count: number;
  language: string;
}): Promise<ITestimonial[] | null> => {
  const testimonials = await TestimonialDB.find({ language: query.language })
    .populate(
      "user",
      "-authId -paymentId -agreePrivacy -receiveCommunications -plan",
    )
    .sort({ updatedAt: "asc" })
    .limit(query.count);

  if (!testimonials) {
    return null;
  }

  return testimonials;
};
