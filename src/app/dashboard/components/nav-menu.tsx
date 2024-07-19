import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import { NavMenuItem, NavMenuItemProps } from './nav-menu-item'

const getInitialSubLinksKeys = (url?: string) => {
	if (!url) {
		return []
	}

	if (url.includes('/projects')) {
		return ['Projects']
	}

	return []
}

export function NavMenu({ navigation }: { navigation: NavMenuItemProps[] }) {
	const pathName = usePathname()

	let [openSubLinksKeys, setOpenSubLinksKeys] = useState<string[]>(
		getInitialSubLinksKeys(pathName),
	)

	let handleParentClick = (key: string) => {
		if (openSubLinksKeys.includes(key)) {
			setOpenSubLinksKeys(prev => prev.filter(k => k !== key))
		} else {
			setOpenSubLinksKeys(prev => [...prev, key])
		}
	}

	return (
		<ul className="flex flex-1 flex-col gap-y-7">
			<AnimatePresence>
				<motion.li
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: '100%', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ type: 'ease-in-out', duration: 0.3 }}
					className=""
				>
					<ul className="-mx-2 space-y-1">
						{navigation.map(({ to, subLinks, ...item }) => (
							<NavMenuItem
								key={item.name}
								to={`/dashboard/${to}`}
								highlight
								subLinks={subLinks?.map(subItem => ({
									...subItem,
									to: `/dashboard/${subItem.to}`,
								}))}
								onParentClick={handleParentClick}
								isParentSelected={openSubLinksKeys.includes(item.name)}
								{...item}
							/>
						))}
					</ul>
				</motion.li>
			</AnimatePresence>
			<li className="mt-auto">
				<Link
					href="/"
					className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 no-underline hover:bg-gray-50 hover:text-regal-blue"
				>
					<HomeIcon
						className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-regal-blue"
						aria-hidden="true"
					/>
					Home
				</Link>
			</li>
		</ul>
	)
}
