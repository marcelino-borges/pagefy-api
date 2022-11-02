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
  userId: string
): Promise<ITestimonial[] | null> => {
  const testimonials = await TestimonialDB.find({ userId })
    .sort({
      createdAt: -1,
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

  return testimonial[testimonial.length - 1];
};
