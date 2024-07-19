import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export interface NavMenuItemProps {
	name: string
	to: string
	icon: React.FC<{
		className?: string
		'aria-hidden'?: boolean | 'true' | 'false'
	}>
	highlight?: boolean
	subLinks?: NavMenuItemProps[]
	isParentSelected?: boolean
	onParentClick?: (key: string) => void
	adminOnly?: boolean
}

export const NavMenuItem = ({
	name,
	to,
	icon: Icon,
	highlight = false,
	subLinks,
	isParentSelected = false,
	onParentClick,
}: NavMenuItemProps) => {
	const currentPath = usePathname()
	const isActive = currentPath === to
	if (subLinks) {
		return (
			<li key={name}>
				<button
					type="button"
					className="flex w-full items-center justify-between gap-x-3.5 rounded-lg px-2 py-2 text-start text-sm text-slate-700 no-underline hover:bg-gray-100 hover:text-regal-blue"
					onClick={() => onParentClick?.(name)}
				>
					<div className="flex items-center gap-2">
						<Icon
							className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-regal-blue"
							aria-hidden="true"
						/>
						{name}
					</div>
					{isParentSelected ? (
						<KeyboardArrowUpIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-regal-blue" />
					) : (
						<KeyboardArrowDownIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-regal-blue" />
					)}
				</button>

				<div
					className={clsx(
						isParentSelected ? 'block' : 'hidden',
						'w-full overflow-hidden transition-[height] duration-300 ',
					)}
				>
					<ul className="px-4 pt-2">
						{subLinks.map(subItem => (
							<Link
								key={subItem.name}
								href={subItem.to}
								className={clsx(
									isActive
										? 'bg-gray-50 text-regal-blue'
										: 'text-gray-700 hover:bg-gray-50 hover:text-regal-blue',
									'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
								)}
							>
								<div className="flex items-center gap-2">
									<subItem.icon
										className={clsx(
											isActive
												? 'text-regal-blue'
												: 'text-gray-400 group-hover:text-regal-blue',
											'h-6 w-6 shrink-0',
										)}
										aria-hidden="true"
									/>
									{subItem.name}
								</div>
							</Link>
						))}
					</ul>
				</div>
			</li>
		)
	}

	return (
		<li key={name}>
			<Link
				href={to}
				className={clsx(
					'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 hover:bg-gray-100 hover:text-regal-blue',
					isActive && highlight
						? 'bg-gray-50 text-regal-blue'
						: 'text-gray-700 hover:bg-gray-50 hover:text-regal-blue',
					'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
				)}
			>
				<div className="flex items-center gap-2">
					<Icon
						className={clsx(
							isActive && highlight
								? 'text-regal-blue'
								: 'text-gray-400 group-hover:text-regal-blue',
							'h-6 w-6 shrink-0',
						)}
						aria-hidden="true"
					/>
					{name}
				</div>
			</Link>
		</li>
	)
}
