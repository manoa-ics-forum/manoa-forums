import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const CreatePostSchema = Yup.object({
  title: Yup.string().required(),
  content: Yup.string().required(),
  category: Yup.string().oneOf(['CAMPUS', 'CLASSES', 'EVENTS', 'FINANCIAL', 'IMPORTANT', 'OTHER', 'RESOURCES', 'SPORTS']).required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});
