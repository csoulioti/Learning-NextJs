'use client'

import { Fragment, type ReactNode } from 'react'
import Link from 'next/link'
import { Typography } from '@mui/material'
import { CircularProgress } from '@mui/material'

interface BreadcrumbsContainerProps {
	items: BreadcrumbItemProps[]
	separator?: string | ReactNode
}

interface BreadcrumbItemProps {
	name: string
	path: string
	isLast?: boolean
}

export const BreadcrumbsItem = ({
	name,
	path,
	isLast,
	...props
}: BreadcrumbItemProps) => {
	if (isLast) {
		return <Typography className="text-regal-blue">{name}</Typography>
	}
	return (
		<li {...props}>
			<Link href={`/${path}`} passHref>
				{name === 'loading' ? <CircularProgress className="h-4 w-4" /> : name}
			</Link>
		</li>
	)
}

export const BreadcrumbsContainer = ({
	items,
	separator = '|',
}: BreadcrumbsContainerProps) => (
	<div className="relative flex min-w-0 flex-1">
		<div className="hidden min-w-0 flex-1 items-center gap-2 align-middle md:flex xl:gap-4">
			<nav className="min-h-6">
				<ol className="flex items-center space-x-4">
					{items.map((item, index) => (
						<Fragment key={index}>
							<BreadcrumbsItem
								name={item.name}
								path={item.path}
								isLast={index === items.length - 1}
							/>
							{index < items.length - 1 ? <span>{separator}</span> : null}
						</Fragment>
					))}
				</ol>
			</nav>
		</div>
		<div className="flex min-w-0 flex-1 items-center align-middle md:hidden">
			<nav className="min-h-6">
				<ol className="flex items-center space-x-4">
					{items.slice(-1).map((item, index) => (
						<Fragment key={index}>
							<BreadcrumbsItem
								name={item.name}
								path={item.path}
								isLast={index === items.slice(-1).length - 1}
							/>
							{index < items.slice(-1).length - 1 ? (
								<span>{separator}</span>
							) : null}
						</Fragment>
					))}
				</ol>
			</nav>
		</div>
	</div>
)
