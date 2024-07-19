'use server'

import { getDbContext } from '@/app/services/db-context.server'
import { revalidatePath } from 'next/cache'

export const deleteProject = async (id: string) => {
	const db = await getDbContext()
	await db.project.deleteProject(id)

	revalidatePath(`/projects`)
}
