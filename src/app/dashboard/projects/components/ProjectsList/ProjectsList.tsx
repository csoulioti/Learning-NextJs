'use client'
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material'
import Link from 'next/link'
import { Project } from '@prisma/client'
import { ActionsMenu } from '@/app/components/actions-menu'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteProject } from '../../actions/delete-project'

export const ProjectsList = ({ projects }: { projects: Project[] }) => {
	const handleDeleteProject = async (id: string) => {
		await deleteProject(id)
	}
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="List of PBL Projects">
				<TableHead>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell>Subhead</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{projects.map(project => (
						<TableRow
							key={project.id}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								<Link
									href={`projects/${project.id}`}
									className="text-regal-blue"
								>
									{project.title || 'Untitled Project'}
								</Link>
							</TableCell>
							<TableCell>
								{project.subhead || 'This project does not have a subhead'}
							</TableCell>

							<TableCell>
								<ActionsMenu
									tooltipTitle="Actions"
									actions={[
										{
											label: 'Edit',
											icon: EditIcon,
											linkUrl: `projects/${project.id}`,
										},
										{
											label: 'Delete',
											icon: DeleteIcon,
											className: 'bg-red-500',
											onClick: () => handleDeleteProject(project.id),
										},
									]}
								/>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	)
}
