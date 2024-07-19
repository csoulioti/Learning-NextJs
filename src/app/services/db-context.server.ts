import { type PrismaClientExtended } from './custom-prisma-client'
import { getPrisma } from './db.server'
import ProjectService from './project.server'

export class DbContext {
	project: ProjectService

	constructor(prisma: PrismaClientExtended) {
		this.project = new ProjectService(prisma, this)
	}
}

/**
 * Gets a instance of the DataService class where the Prisma client has been restricted
 * by access control rules for the context of the given request.
 * For the purpose of this task, no rules have been provided to determine the access level.
 * It could be the authenticated user and the url of the request
 */
export async function getDbContext() {
	const prisma = await getPrisma()
	return new DbContext(prisma)
}
