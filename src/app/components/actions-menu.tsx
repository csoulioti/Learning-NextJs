import {
	IconButton,
	Menu,
	MenuItem,
	MenuProps,
	SvgIconTypeMap,
	Tooltip,
	alpha,
	styled,
} from '@mui/material'
import clsx from 'clsx'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { useRouter } from 'next/navigation'

interface ActionsMenuItem {
	label: string
	icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
	linkUrl?: string
	onClick?: () => void
	className?: string
}

interface ActionsMenuProps {
	actionButton?: JSX.Element
	actions: ActionsMenuItem[]
	tooltipTitle?: string
}

export function ActionsMenu({
	actions,
	actionButton = <MoreVertIcon className="h-5 w-5" aria-hidden="true" />,
	tooltipTitle,
}: ActionsMenuProps) {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const router = useRouter()
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}
	const handleAction = (key: string) => {
		return () => {
			const action = actions.find(a => a.label === key)
			if (!action) return
			if (action.onClick) {
				action.onClick()
			} else if (action.linkUrl) {
				router.push(action.linkUrl)
			}
		}
	}
	return (
		<>
			<Tooltip title={tooltipTitle}>
				<IconButton
					onClick={handleClick}
					size="small"
					sx={{ ml: 2 }}
					aria-controls={open ? 'action-menu' : undefined}
					aria-haspopup="true"
					aria-expanded={open ? 'true' : undefined}
				>
					<span className="sr-only">Open options</span>
					{actionButton}
				</IconButton>
			</Tooltip>
			<StyledMenu
				id="action-menu"
				MenuListProps={{
					'aria-labelledby': 'action-menu-button',
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{actions.map(action => (
					<MenuItem
						onClick={handleAction(action.label)}
						key={action.label}
						id={action.label}
						className={clsx('gap-2', action.className)}
					>
						{action.icon && <action.icon className="h-4 w-4" />}
						{action.label}
					</MenuItem>
				))}
			</StyledMenu>
		</>
	)
}
const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 180,
		color:
			theme.palette.mode === 'light'
				? 'rgb(55, 65, 81)'
				: theme.palette.grey[300],
		boxShadow:
			'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity,
				),
			},
		},
	},
}))
