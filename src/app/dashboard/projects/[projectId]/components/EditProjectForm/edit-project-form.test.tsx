import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import { FormProvider } from 'react-hook-form'
import { EditProjectForm } from './edit-project-form'

const { useRouter, mockedRouterPush } = vi.hoisted(() => {
	const mockedRouterPush = vi.fn()
	return {
		useRouter: () => ({ push: mockedRouterPush }),
		mockedRouterPush,
	}
})

vi.mock('next/navigation', async () => {
	const actual = await vi.importActual('next/navigation')
	return {
		...actual,
		useRouter,
	}
})

const useFormMock = vi.fn().mockReturnValue({
	control: {},
	handleSubmit: vi.fn(),
	formState: {
		errors: {},
		isSubmitSuccessful: false,
	},
})

// Mock upsertProject function
vi.mock('@/app/dashboard/projects/[projectId]/actions/upsert-project', () => ({
	upsertProject: vi.fn().mockImplementation(async data => {
		// Simulate server-side delay
		await new Promise(resolve => setTimeout(resolve, 1000))
		console.log('data', data)
		return { ...data, id: 'mocked-project-id' } // Mocked response
	}),
}))

describe('EditProjectForm', () => {
	it('renders form with initial values', () => {
		const defaultValues = {
			id: 'mock-id',
			title: 'Mock Project',
			subhead: 'Mock Subhead',
			description: 'Mock Description',
		}

		render(
			<FormProvider {...useFormMock({ defaultValues })}>
				<EditProjectForm project={defaultValues} />
			</FormProvider>,
		)

		expect(screen.getByText('Mock Project')).toBeInTheDocument()
		expect(screen.getByLabelText('Project Title')).toHaveValue('Mock Project')
		expect(screen.getByLabelText('Project Subhead')).toHaveValue('Mock Subhead')
		expect(screen.getByLabelText('Project Descripton')).toHaveValue(
			'Mock Description',
		)
	})

	it('submits form data and redirects on successful submit', async () => {
		const defaultValues = {
			id: 'new',
			title: 'Mock Project',
			subhead: 'Mock Subhead',
			description: 'Mock Description',
		}

		render(
			<FormProvider {...useFormMock({ defaultValues })}>
				<EditProjectForm project={defaultValues} />
			</FormProvider>,
		)

		const titleInput = screen.getByLabelText('Project Title')
		const subheadInput = screen.getByLabelText('Project Subhead')
		const descriptionInput = screen.getByLabelText('Project Descripton')

		fireEvent.change(titleInput, { target: { value: 'Updated Title' } })
		fireEvent.change(subheadInput, { target: { value: 'Updated Subhead' } })
		fireEvent.change(descriptionInput, {
			target: { value: 'Updated Description' },
		})
		// Wait for auto-save debounce period
		await new Promise(resolve => setTimeout(resolve, 1100))

		// Wait for the form to submit and auto-save to complete
		// Mock upsertProject function
		await waitFor(() => {
			expect(mockedRouterPush).toHaveBeenCalledWith(
				'/dashboard/projects/mocked-project-id',
			)
		})
	})
})
