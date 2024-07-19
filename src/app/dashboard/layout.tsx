'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BreadcrumbsContainer } from '../components/breadcrumb'
import { Logo } from './components/logo'
import { usePathname } from 'next/navigation'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import { BreadCrumbsContext } from '../hooks/use-breadcrumb'
import { NavMenu } from './components/nav-menu'
import { NavMenuItemProps } from './components/nav-menu-item'
import { Avatar } from '@mui/material'
import { ActionsMenu } from '../components/actions-menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SettingsIcon from '@mui/icons-material/Settings'
import BarChartIcon from '@mui/icons-material/BarChart'
import LogoutIcon from '@mui/icons-material/Logout'

const navigation: NavMenuItemProps[] = [
	{
		name: 'Dashboard',
		to: '',
		icon: DashboardIcon,
	},
	{
		name: 'Projects',
		to: 'projects',
		icon: AssignmentIcon,
	},
]

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	// Paths are used by the Breadcrumb component
	// TODO: Code Improvement
	const paths = usePathname()
	const [trailingPath, setTrailingPath] = useState('')
	const context = useMemo(
		() => ({
			trailingPath,
			setTrailingPath,
		}),
		[trailingPath],
	)

	const pathNames = paths.split('/').filter(path => path)
	const pathItems = pathNames.map((path, i) => ({
		name: path,
		path: pathNames.slice(0, i + 1).join('/'),
	}))

	if (
		context.trailingPath &&
		pathItems.length > 0 &&
		context.trailingPath !== pathItems[pathItems.length - 1].name
	) {
		pathItems[pathItems.length - 1].name = context.trailingPath
	}
	return (
		<>
			{/* Sidebar for mobile */}
			<AnimatePresence>
				{sidebarOpen && (
					<div className="relative z-50 lg:hidden">
						{/* Overlay */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ type: 'ease-linear', duration: 0.3 }}
							className="fixed inset-0 bg-gray-900/80"
						/>

						{/* Drawer */}
						<div className="fixed inset-0 flex">
							<motion.div
								initial={{ x: '-100%' }}
								animate={{ x: 0 }}
								exit={{ x: '-100%' }}
								transition={{ type: 'ease-in-out', duration: 0.3 }}
								className="relative mr-16 flex w-full max-w-xs flex-1"
							>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ type: 'ease-in-out', duration: 0.3 }}
									className="absolute left-full top-0 flex w-16 justify-center pt-5"
								>
									<button
										type="button"
										className="-m-2.5 p-2.5"
										onClick={() => setSidebarOpen(false)}
									>
										<span className="sr-only">Close sidebar</span>
										<CloseIcon
											className="h-6 w-6 text-white"
											aria-hidden="true"
										/>
									</button>
								</motion.div>
								<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
									<div className="flex h-16 shrink-0 items-center">
										<Logo />
									</div>
									<nav className="flex flex-1 flex-col">
										<NavMenu navigation={navigation} />
									</nav>
								</div>
							</motion.div>
						</div>
					</div>
				)}
			</AnimatePresence>

			<div>
				{/* Static sidebar for desktop */}
				<div className="hidden bg-white lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
					{/* Sidebar component */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pb-4">
						<div className="flex h-16 shrink-0 items-center">
							<Logo className="h-16 w-16" aria-hidden="true" />
						</div>
						<nav className="flex flex-1 flex-col">
							<NavMenu navigation={navigation} />
						</nav>
					</div>
				</div>

				<div className="flex min-h-[100vh] flex-col lg:pl-56">
					<div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
						<button
							type="button"
							className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
							onClick={() => setSidebarOpen(prev => !prev)}
						>
							<span className="sr-only">Open sidebar</span>
							<MenuIcon className="h-6 w-6" aria-hidden="true" />
						</button>

						<div
							className="h-6 w-px bg-gray-200 lg:hidden"
							aria-hidden="true"
						/>
						<div className="flex min-w-0 flex-1 gap-x-4 self-stretch lg:gap-x-6">
							<BreadcrumbsContainer items={pathItems} />
							<div className="flex items-center gap-x-4 lg:gap-x-6">
								<ActionsMenu
									tooltipTitle="My Profile"
									actionButton={<Avatar>CS</Avatar>}
									actions={[
										{
											label: 'My Account',
											icon: AccountCircleIcon,
											linkUrl: '/',
										},
										{
											label: 'Settings',
											icon: SettingsIcon,
											linkUrl: '/',
										},
										{
											label: 'Analytics',
											icon: BarChartIcon,
											linkUrl: '/',
										},
										{
											label: 'Logout',
											icon: LogoutIcon,
											linkUrl: '/',
										},
									]}
								/>
							</div>
						</div>
					</div>

					<main className="flex flex-grow flex-col">
						<div className="flex flex-grow flex-col px-4 py-10 sm:px-6 lg:px-8">
							<BreadCrumbsContext.Provider value={context}>
								{children}
							</BreadCrumbsContext.Provider>
						</div>
					</main>
				</div>
			</div>
		</>
	)
}
