import util from 'util'
import { Prisma } from '@prisma/client'

//extension for soft delete
export const softDelete = Prisma.defineExtension({
	name: 'softDelete',
	model: {
		$allModels: {
			async delete<M, A>(
				this: M,
				where: Prisma.Args<M, 'delete'>['where'],
			): Promise<Prisma.Result<M, A, 'update'>> {
				const context = Prisma.getExtensionContext(this)

				return (context as any).update({
					where,
					data: {
						deleted: true,
					},
				})
			},
		},
	},
})

//extension for soft delete Many
export const softDeleteMany = Prisma.defineExtension({
	name: 'softDeleteMany',
	model: {
		$allModels: {
			async deleteMany<M, A>(
				this: M,
				where: Prisma.Args<M, 'deleteMany'>['where'],
			): Promise<Prisma.Result<M, A, 'updateMany'>> {
				const context = Prisma.getExtensionContext(this)

				return (context as any).updateMany({
					where,
					data: {
						deleted: true,
					},
				})
			},
		},
	},
})
const logThreshold = 20
export const logLongRunningQueries = Prisma.defineExtension(client => {
	return client.$extends({
		query: {
			$allModels: {
				async $allOperations({ operation, model, args, query }) {
					const start = performance.now()
					const result = await query(args)
					const end = performance.now()
					const time = end - start
					if (time > logThreshold)
						console.log(
							util.inspect(
								{ model, operation, args, time },
								{ showHidden: false, depth: null, colors: true },
							),
						)
					return result
				},
			},
		},
	})
})
