'use client'

import useBreadCrumbs from '@/app/hooks/use-breadcrumb'
import { upsertProject } from '@/app/dashboard/projects/[projectId]/actions/upsert-project'
import { UpsertInput } from '@/app/services/db.server'
import { Button, Grid, Paper, TextField, Typography } from '@mui/material'
import { Project } from '@prisma/client'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import AutoSave from '@/app/components/autosave'
import {
	EditProjectFormSchemaType,
	EditProjectSchema,
} from '@/app/dashboard/projects/[projectId]/schemas/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

export const EditProjectForm = ({
	project,
}: {
	project: UpsertInput<Project>
}) => {
	const router = useRouter()
	const defaultValues = {
		id: project.id,
		title: project.title,
		subhead: project.subhead,
		description: project.description,
	}
	const methods = useForm({
		defaultValues,
		mode: 'onBlur',
		// Specify resolver for form validation using Zod
		resolver: zodResolver(EditProjectSchema),
	})
	const {
		register,
		reset,
		formState: { errors, isSubmitSuccessful },
	} = methods

	const [submittedData, setSubmittedData] =
		useState<EditProjectFormSchemaType>(defaultValues)

	useBreadCrumbs(submittedData.title || 'new')

	const onSubmit = async (data: EditProjectFormSchemaType) => {
		const updatedProject = (await upsertProject({
			...data,
		})) as EditProjectFormSchemaType
		setSubmittedData({ ...data, id: updatedProject.id })
		// Redirect to the new entity's page using its Id
		data.id === 'new' && router.push(`/dashboard/projects/${updatedProject.id}`)
	}

	useEffect(() => {
		if (isSubmitSuccessful) {
			reset({ ...submittedData })
		}
	}, [isSubmitSuccessful, submittedData, reset])

	return (
		<Paper sx={{ padding: 2 }}>
			<Typography variant="h2">{submittedData.title}</Typography>
			<FormProvider {...methods}>
				<form>
					<input type="hidden" value={submittedData.id} {...register('id')} />
					<Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
						<Grid item xs={12} md={5} lg={4}>
							<TextField
								fullWidth
								label="Project Title"
								placeholder="Enter the project title, eg. 'Power of the punch'"
								error={!!errors.title}
								{...register('title')}
								helperText={errors.title?.message}
							/>
						</Grid>
						<Grid item xs={12} md={7} lg={8}>
							<TextField
								fullWidth
								label="Project Subhead"
								placeholder="Use a small sentence to describe the project, eg. 'Students will learn Newtons Laws while constructing a boxing glove'"
								error={!!errors.subhead}
								{...register('subhead')}
								helperText={errors.subhead?.message}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Project Descripton"
								placeholder="Describe the project in detail (suggested length: 300 words)"
								multiline
								rows={4}
								error={!!errors.description}
								{...register('description')}
								helperText={errors.description?.message}
							/>
						</Grid>
					</Grid>
					<AutoSave onSubmit={onSubmit} defaultValues={defaultValues} />
				</form>
			</FormProvider>
		</Paper>
	)
}
