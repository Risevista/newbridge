import { z, defineCollection } from 'astro:content';

const newsCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            date: z.date(),
            image: z
            .union([image(), z.string()])
            .optional()
            .transform((img) => (img === "" ? undefined : img)),
        }),
});
const alacarteCollection = defineCollection({
    type: 'content',
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            lunchdinner: z.string(),
            sort: z.number(),
            image: image(),
        }),
});

export const collections = {
    news: newsCollection,
    alacarte: alacarteCollection,
};
