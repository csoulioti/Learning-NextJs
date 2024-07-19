import { render, screen, fireEvent } from '@testing-library/react'
import { BreadcrumbsContainer } from './breadcrumb'
import { describe, it, expect, beforeEach } from 'vitest'

describe('Breadcrumbs', () => {
	const items = [
		{ name: 'Home', path: 'home' },
		{ name: 'About', path: 'about' },
		{ name: 'Contact', path: 'contact' },
	]

	it('renders BreadcrumbsContainer with items', () => {
		render(<BreadcrumbsContainer items={items} />)
		expect(screen.getByText('Home')).toBeInTheDocument()
		expect(screen.getByText('About')).toBeInTheDocument()
	})

	it('renders the last item as a Typography component', () => {
		render(<BreadcrumbsContainer items={items} />)
		const lastItem = screen.getAllByText('Contact')
		expect(lastItem[1].tagName).toBe('P') // Typography renders as a <p> tag
	})

	it('renders separators between items', () => {
		render(<BreadcrumbsContainer items={items} separator=">" />)
		const separators = screen.getAllByText('>')
		expect(separators).toHaveLength(2) // There should be 2 separators for 3 items
	})
})
