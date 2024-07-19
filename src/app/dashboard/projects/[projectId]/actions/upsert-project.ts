'use server'

import { getDbContext } from '@/app/services/db-context.server'
import { EditProjectFormSchemaType, EditProjectSchema } from '../schemas/schema'
import { revalidatePath } from 'next/cache'

export const upsertProject = async (project: EditProjectFormSchemaType) => {
	// Run validations
	const result = EditProjectSchema.safeParse(project)

	if (!result.success) {
		return { success: false, error: result.error.format() }
	}
	const db = await getDbContext()
	const updatedProject = await db.project.upsert({
		id: project.id !== 'new' ? project.id || '' : '',
		title: project.title,
		subhead: project.subhead,
		description: project.description,
	})

	revalidatePath(`/project/${updatedProject.id}`)
	revalidatePath(`/projects`)
	return updatedProject
}
