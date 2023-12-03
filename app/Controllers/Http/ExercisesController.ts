import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Exercise from 'App/Models/Exercise'
import ExerciceValidator from 'App/Validators/ExerciceValidator'

export default class ExercisesController {
    /**
     * Show all exercises
     * @param response
     */
    public async index({ response }: HttpContextContract) {
        const exercises = await Exercise.all()

        return response.ok(exercises)
    }

    /**
     * Show an exercise
     * @param params
     * @param response
     */
    public async show({ params, response }: HttpContextContract) {
        const exercise = await Exercise.findOrFail(params.id)

        return response.ok(exercise)
    }

    /**
     * Store a new exercise
     * @param request
     * @param response
     */
    public async create({ request, response }: HttpContextContract) {
        const payload = await request.validate(ExerciceValidator)

        await Exercise.create(payload)

        return response.created(payload)
    }

    /**
     * Update an exercise
     * @param params
     * @param request
     * @param response
     */
    public async update({ params, request, response }: HttpContextContract) {
        const payload = await request.validate(ExerciceValidator)

        const exercise = await Exercise.findOrFail(params.id)

        await exercise.merge(payload).save()

        return response.ok(exercise)
    }

    /**
     * Delete an exercise
     * @param params
     * @param response
     */
    public async destroy({ params, response }: HttpContextContract) {
        const exercise = await Exercise.findOrFail(params.id)

        await exercise.delete()

        return response.noContent()
    }
}
