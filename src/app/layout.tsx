import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import { CssBaseline, GlobalStyles } from '@mui/material'
import './styles/tailwind.css'

export const metadata: Metadata = {
	title: 'Learning Nextjs',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<GlobalStyles
							styles={{
								body: { backgroundColor: '#eaeaea', padding: 10 },
							}}
						/>
						{children}
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	)
}
