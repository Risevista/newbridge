import { defineCollection, z } from "astro:content";

const blogCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
