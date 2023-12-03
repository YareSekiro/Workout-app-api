// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExercisesDetail from 'App/Models/ExercisesDetail'
import { assert } from 'App/utils'
import ExercisesDetailValidator from 'App/Validators/ExercisesDetailValidator'

export default class ExercisesDetailsController {
    /**
     * Vérification de la propriété de l'entraînement
     * @param auth
     * @param trainingId
     * @param response
     * @private
     */
    private async checkOwnership(auth: HttpContextContract['auth'], trainingId: number) {
        assert(auth.user, 'User not found')
        await auth.user.related('trainings').query().where('id', trainingId).firstOrFail()
    }

    /**
     * Show all exercises
     * @param auth
     * @param params
     * @param response
     */
    public async index({ auth, params, response }: HttpContextContract) {
        await this.checkOwnership(auth, params.trainingId)

        const exercises = await ExercisesDetail.all()

        return response.ok(exercises)
    }

    /**
     * Show an exercise
     * @param auth
     * @param params
     * @param response
     *
     */
    public async show({ auth, params, response }: HttpContextContract) {
        await this.checkOwnership(auth, params.trainingId)

        const exercise = await ExercisesDetail.findOrFail(params.id)

        return response.ok(exercise)
    }

    /**
     * Store a new exercise
     * @param auth
     * @param params
     * @param request
     * @param response
     */
    public async create({ auth, params, request, response }: HttpContextContract) {
        await this.checkOwnership(auth, params.trainingId)

        const { setNumber, reps, weight, restTime } =
            await request.validate(ExercisesDetailValidator)

        const model = await ExercisesDetail.create({
            trainingExerciseId: params.trainingId,
            setNumber,
            reps,
            weight,
            restTime,
        })

        return response.created(model)
    }

    /**
     * Update an exercise
     * @param auth
     * @param params
     * @param request
     * @param response
     */
    public async update({ auth, params, request, response }: HttpContextContract) {
        await this.checkOwnership(auth, params.trainingId)

        const { setNumber, reps, weight, restTime } =
            await request.validate(ExercisesDetailValidator)

        const exercise = await ExercisesDetail.findOrFail(params.id)

        await exercise
            .merge({ trainingExerciseId: params.trainingId, setNumber, reps, weight, restTime })
            .save()

        return response.ok(exercise)
    }

    /**
     * Delete an exercise
     * @param auth
     * @param params
     * @param response
     */
    public async destroy({ auth, params: { id, trainingId }, response }: HttpContextContract) {
        await this.checkOwnership(auth, trainingId)

        const exercise = await ExercisesDetail.findOrFail(id)

        await exercise.delete()

        return response.noContent()
    }
}
