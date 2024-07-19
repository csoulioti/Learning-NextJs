import { PrismaClient } from '@prisma/client'
import {
	logLongRunningQueries,
	softDelete,
	softDeleteMany,
} from './prisma.extensions'

// Function to give us a prismaClient with the extensions we want
export const customPrismaClient = (prismaClient: PrismaClient) => {
	return prismaClient
		.$extends(softDelete) //here we add our created extensions
		.$extends(softDeleteMany)
		.$extends(logLongRunningQueries)
}

// Our Custom Prisma Client with the client set to the customPrismaClient with extension
export class PrismaClientExtended extends PrismaClient {
	customPrismaClient: CustomPrismaClient | undefined

	get clientSoftDelete() {
		if (!this.customPrismaClient)
			this.customPrismaClient = customPrismaClient(this)

		return this.customPrismaClient
	}
}

// Create a type to our function
export type CustomPrismaClient = ReturnType<typeof customPrismaClient>
