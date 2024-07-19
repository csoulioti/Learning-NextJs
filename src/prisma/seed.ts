import { getUnrestrictedPrisma } from '../app/services/db.server'
import { cleanupDb, createProjectData } from '../tests/db-utils'

const prisma = getUnrestrictedPrisma('I know what I am doing')

async function seed() {
	console.log('🌱 Seeding...')
	console.time(`🌱 Database has been seeded`)

	if (process.env.NODE_ENV !== 'production') {
		console.time('🧹 Cleaned up the database...')
		await cleanupDb(prisma)
		console.timeEnd('🧹 Cleaned up the database...')
	}

	console.time('🔑 Created projects...')
	for (let i = 0; i < 5; i++) {
		await prisma.project.create({
			data: createProjectData(),
		})
	}

	console.timeEnd('🔑 Created projects...')

	console.timeEnd(`🌱 Database has been seeded`)
}

seed()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
