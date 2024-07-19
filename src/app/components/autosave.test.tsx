import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React, { ReactNode } from 'react'
import { vi, expect, describe, it } from 'vitest'
import AutoSave from './autosave'
import { FormProvider, useForm } from 'react-hook-form'

const defaultValues = {
	title: '',
	subhead: '',
}
const onSubmit = vi.fn()
const Wrapper = ({ children }: { children: ReactNode }) => {
	const methods = useForm({
		defaultValues,
	})
	const { register } = methods
	return (
		<FormProvider {...methods}>
			<form>
				<input data-testid="input" {...register('title')} />
				<input data-testid="input_subhead" {...register('subhead')} />
				{children}
			</form>
		</FormProvider>
	)
}
describe('AutoSave', () => {
	it('calls onSubmit when form data changes', async () => {
		render(
			<Wrapper>
				<AutoSave defaultValues={defaultValues} onSubmit={onSubmit} />
			</Wrapper>,
		)

		const input = screen.getByTestId('input')
		fireEvent.change(input, { target: { value: 'John Doe' } })
		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				{ title: 'John Doe', subhead: '' },
				undefined, // Because of the way react-hook-form handles form submissions
			)
		})
	})

	it('shows CircularProgress when submitting', async () => {
		render(
			<Wrapper>
				<AutoSave defaultValues={defaultValues} onSubmit={onSubmit} />
			</Wrapper>,
		)

		const input = screen.getByTestId('input')
		fireEvent.change(input, { target: { value: 'John Doe' } })

		await waitFor(() => {
			expect(screen.getByRole('progressbar')).toBeInTheDocument()
		})

		// Wait for the form submission to complete
		await new Promise(r => setTimeout(r, 1100))

		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
	})

	it('handles user typing while saving is happening', async () => {
		render(
			<Wrapper>
				<AutoSave defaultValues={defaultValues} onSubmit={onSubmit} />
			</Wrapper>,
		)

		const titleInput = screen.getByTestId('input')

		// Simulate initial input change triggering auto-save
		fireEvent.change(titleInput, { target: { value: 'Initial Value' } })

		// Wait for the debounce period to start auto-save
		await waitFor(() => {
			expect(onSubmit).toHaveBeenCalledWith(
				{ title: 'Initial Value', subhead: '' },
				undefined,
			)
		})

		// Simulate user typing while auto-save is ongoing
		fireEvent.change(titleInput, { target: { value: 'Modified Value' } })

		// Wait for any pending auto-save to complete
		await new Promise(resolve => setTimeout(resolve, 1000))

		// Ensure onSubmit was called twice, one with the Initial Value and the other with the latest value after typing
		expect(onSubmit).toHaveBeenCalledTimes(2)
		expect(onSubmit).toHaveBeenCalledWith(
			{ title: 'Modified Value', subhead: '' },
			undefined,
		)
	})

	it('triggers auto-save on rapid field value changes', async () => {
		render(
			<Wrapper>
				<AutoSave defaultValues={defaultValues} onSubmit={onSubmit} />
			</Wrapper>,
		)

		const titleInput = screen.getByTestId('input')
		const subheadInput = screen.getByTestId('input_subhead')

		// Simulate rapid tabbing and value changes
		fireEvent.focus(titleInput)
		fireEvent.change(titleInput, { target: { value: 'John' } })
		fireEvent.focus(subheadInput)
		fireEvent.change(subheadInput, { target: { value: 'Doe' } })

		// Wait for debounce period to trigger auto-save
		await waitFor(() => {
			// Check if onSubmit was called with the correct values
			expect(onSubmit).toHaveBeenCalledWith(
				{ title: 'John', subhead: 'Doe' },
				undefined, // Because of the way react-hook-form handles form submissions, passing additional arguments to the onSubmit function
			)
		})
	})
})
