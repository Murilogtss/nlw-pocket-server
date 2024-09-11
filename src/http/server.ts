import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { createGoal } from '../functions/create-goal'
import z from 'zod'
import { getWeekPedingGoals } from '../functions/get-week-pending-goals'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.post(
  '/goals',
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number().int().min(1).max(7),
      }),
    },
  },
  async req => {
    const { title, desiredWeeklyFrequency } = req.body

    await createGoal({
      title,
      desiredWeeklyFrequency,
    })
  }
)

app.get('/peding-goals', async () => {
  const { pendingGoals } = await getWeekPedingGoals()
  return { pendingGoals }
})

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP Server running on http://localhost:3333')
})
