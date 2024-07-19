import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'
import '@testing-library/jest-dom/vitest'

// Ensure that the DOM and all mocks are cleaned up after each test
afterEach(() => {
	cleanup()
	vi.clearAllMocks()
})

// Mock
vi.doMock('next/navigation', async () => {
	const actual = await vi.importActual('next/navigation')
	return {
		...actual,
		useRouter: vi.fn(() => ({
			push: vi.fn(),
			replace: vi.fn(),
		})),
		useSearchParams: vi.fn(() => ({
			// get: vi.fn(),
		})),
		usePathname: vi.fn(),
	}
})

vi.doMock('debounce', () => ({
	default: (fn, delay) => {
		let timeout
		return (...args) => {
			if (timeout) clearTimeout(timeout)
			timeout = setTimeout(() => {
				fn(...args)
			}, delay)
		}
	},
}))
