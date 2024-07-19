import { Prisma, type Project } from '@prisma/client'
import { type PrismaClientExtended } from './custom-prisma-client'
import { type UpsertInput } from './db.server'
import { type DbContext } from './db-context.server'

export default class ProjectService {
	prisma: PrismaClientExtended
	context: DbContext

	constructor(prisma: PrismaClientExtended, context: DbContext) {
		this.prisma = prisma
		this.context = context
	}

	async upsert({ id, ...project }: UpsertInput<Project>) {
		return await this.prisma.project.upsert({
			where: { id },
			update: {
				...project,
			},
			create: {
				...project,
			},
		})
	}

	async getProjects() {
		return await this.prisma.project.findMany({
			orderBy: { id: Prisma.SortOrder.asc },
		})
	}

	async findById(id: string) {
		return await this.prisma.project.findUnique({
			where: { id },
		})
	}

	async deleteProject(id: string) {
		return await this.prisma.clientSoftDelete.project.delete({
			id,
		})
	}
}
