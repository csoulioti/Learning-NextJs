import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ActionsMenu } from './actions-menu'
import { describe, it, expect, vi } from 'vitest'

const { useRouter, mockedRouterPush } = vi.hoisted(() => {
	const mockedRouterPush = vi.fn()
	return {
		useRouter: () => ({ push: mockedRouterPush }),
		mockedRouterPush,
	}
})
vi.mock('next/navigation', () => ({
	useRouter,
}))
describe('ActionsMenu', () => {
	const actions = [
		{ label: 'Action 1', onClick: vi.fn() },
		{ label: 'Action 2', linkUrl: '/path/to/page' },
	]

	it('renders the action button and tooltip', async () => {
		render(<ActionsMenu actions={actions} tooltipTitle="Menu Tooltip" />)
		const button = screen.getByRole('button', { name: /menu/i })
		expect(button).toBeInTheDocument()
		// Simulate hover
		fireEvent.mouseOver(button)
		// Check for the tooltip
		expect(await screen.findByText('Menu Tooltip')).toBeInTheDocument()
	})

	it('opens the menu on button click', async () => {
		render(<ActionsMenu actions={actions} tooltipTitle="Menu" />)
		const button = screen.getByRole('button', { name: /menu/i })

		fireEvent.click(button)
		expect(screen.getByRole('menu')).toBeInTheDocument()
	})

	it('executes onClick action when a menu item is clicked', () => {
		render(<ActionsMenu actions={actions} tooltipTitle="Menu" />)
		const button = screen.getByRole('button', { name: /menu/i })

		fireEvent.click(button)
		fireEvent.click(screen.getByText('Action 1'))

		expect(actions[0].onClick).toHaveBeenCalled()
	})

	it('navigates to linkUrl when a menu item is clicked', () => {
		render(<ActionsMenu actions={actions} tooltipTitle="Menu" />)
		const button = screen.getByRole('button', { name: /menu/i })

		fireEvent.click(button)

		fireEvent.click(screen.getByText('Action 2'))

		expect(mockedRouterPush).toHaveBeenCalledWith('/path/to/page')
	})
})
