import { z } from 'zod'

export const EditProjectSchema = z.object({
	id: z.string().optional(),
	title: z.string().min(6, 'Title must be at least 6 characters long'),
	subhead: z.string().min(10, 'Subhead must be at least 10 characters long'),
	description: z
		.string()
		.min(10, 'Description must be at least 10 characters long'),
})

export type EditProjectFormSchemaType = z.infer<typeof EditProjectSchema>
