import { remember } from '@epic-web/remember'
import { PrismaClientExtended } from './custom-prisma-client'
import { enhance } from '@zenstackhq/runtime'

/** A generic type to omit the auto-generated fields from a DB model */
export type CreateInput<T> = Omit<
	T,
	'id' | 'createdAt' | 'updatedAt' | 'deleted'
>
/** A generic type to omit the auto-generated fields from a DB model */
export type UpsertInput<T> = Omit<T, 'createdAt' | 'updatedAt' | 'deleted'>

/**
 * Represent the object that is mapped to the `auth()` context in the schema.zmodel file.
 */
interface ZenAuth extends Record<string, unknown> {
	id: string
	clerkId: string
}

const prisma = remember('prisma', () => {
	// NOTE: if you change anything in this function you'll need to restart
	// the dev server to see your changes.

	let client = new PrismaClientExtended()
	client.$connect()
	return client
})

/**
 * Returns the unrestricted Prisma client without access policies or data validation. This
 * should rarely be used for data access, only in the seed file or for testing. It is
 * highly recommended to use the `getPrisma` function instead.
 */
export const getUnrestrictedPrisma = (confirmation?: string) => {
	if (confirmation !== 'I know what I am doing') {
		throw new Error(
			'Are you sure you need to use this Prisma Client? ' +
				'You must pass `I know what I am doing` to get the unrestricted Prisma client.',
		)
	}
	return prisma
}

/**
 * Returns the Prisma client with access control and data validation so that data is
 * never returned to the client that the user should not have access to. This also
 * prevents modifying data that the user should not be able to modify.
 */
export const getPrisma = () => {
	const user: ZenAuth = {
		id: '',
		clerkId: '',
	}
	// create a wrapper of Prisma client that enforces access policy,
	// data validation, and @password, @omit behaviors. The `user` is exposed as the
	// `auth()` object in the schema.zmodel file.

	return enhance(
		prisma,
		{ user },
		{ logPrismaQuery: process.env.NODE_ENV !== 'production' },
	)
}
