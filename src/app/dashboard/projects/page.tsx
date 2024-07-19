import { ProjectsList } from '@/app/dashboard/projects/components/ProjectsList/ProjectsList'
import { Button, Stack } from '@mui/material'
import { getDbContext } from '@/app/services/db-context.server'
import { Add } from '@mui/icons-material'

export default async function Page() {
	const db = await getDbContext()
	const projects = await db.project.getProjects()
	return (
		<Stack spacing={2}>
			<Button
				sx={{ alignSelf: 'flex-end' }}
				startIcon={<Add />}
				variant="contained"
				href="/dashboard/projects/new"
			>
				Create Project
			</Button>
			<ProjectsList projects={projects} />
		</Stack>
	)
}
