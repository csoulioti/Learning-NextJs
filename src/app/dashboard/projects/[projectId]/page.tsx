import { getDbContext } from '@/app/services/db-context.server'
import { notFound } from 'next/navigation'
import { EditProjectForm } from './components/EditProjectForm/edit-project-form'

export default async function Page({
	params,
}: {
	params: { projectId: string }
}) {
	const db = await getDbContext()
	const project =
		params.projectId !== 'new'
			? await db.project.findById(params.projectId)
			: { id: 'new', title: '', subhead: '', description: '' }
	if (!project) {
		return notFound()
	}
	return <EditProjectForm project={project} />
}
