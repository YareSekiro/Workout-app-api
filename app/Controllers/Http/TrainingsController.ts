import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Training from 'App/Models/Training'
import { assert } from 'App/utils'

export default class TrainingsController {
    /**
     * Store a new training
     * @param auth
     * @param request
     * @param response
     */
    public async create({ auth, request, response }: HttpContextContract) {
        const { name } = request.all()

        await Training.create({
            name,
            userId: auth.user?.id,
        })

        return response.created({ name })
    }

    /**
     * Show all trainings
     * @param auth
     * @param response
     */
    public async index({ auth, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const trainings = await auth.user.related('trainings').query()

        return response.ok(trainings)
    }

    /**
     * Show a training
     * @param auth
     * @param params
     * @param response
     */
    public async show({ auth, params, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.id)
            .preload('exercises')
            .firstOrFail()

        return response.ok(training)
    }

    /**
     * Show exercises of a training
     * @param auth
     * @param params
     * @param response
     */
    public async showExercises({ auth, params, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.id)
            .preload('exercises')
            .firstOrFail()

        return response.ok(training.exercises)
    }

    /**
     * Update a training
     * @param auth
     * @param params
     * @param request
     * @param response
     */
    public async update({ auth, params, request, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const { name } = request.all()

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.id)
            .firstOrFail()

        await training.merge({ name }).save()

        return response.ok(training)
    }

    /**
     * Delete a training
     * @param auth
     * @param params
     * @param response
     */
    public async delete({ auth, params, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.id)
            .firstOrFail()

        await training.delete()

        return response.ok(training)
    }

    /**
     * Attach an exercise to a training
     * @param auth
     * @param params
     * @param request
     * @param response
     */
    public async attach({ auth, params, request, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const { exerciseId, totalSets } = request.all()

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.trainingId)
            .firstOrFail()

        await training.related('exercises').attach({
            [exerciseId]: {
                total_sets: totalSets,
            },
        })

        return response.ok(training)
    }

    /**
     * Detach an exercise from a training
     * @param auth
     * @param params
     * @param request
     * @param response
     */
    public async detach({ auth, params, request, response }: HttpContextContract) {
        assert(auth.user, 'User not found')

        const { exerciseId } = request.all()

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.trainingId)
            .firstOrFail()

        await training.related('exercises').detach([exerciseId])

        return response.ok(training)
    }
}
