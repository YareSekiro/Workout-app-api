import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import TrainingExercice from "../../Models/TrainingExercice";

import ExerciceValidator from '../../Validators/ExerciceValidator';
import ExerciceUpdateValidator from '../../Validators/ExerciceUpdateValidator';
import { assert } from '../../utils'

export default class TrainingExercicesController {
    // Création d'un exercice dans un training
    public async create({ params, request, response }: HttpContextContract) {

        try {

            const payload = await request.validate(ExerciceValidator);
            // @ts-ignore
            payload.trainingId = params.trainingId;
            // @ts-ignore
            await TrainingExercice.create(payload);

            return response.json(payload);

        } catch (error) {
            return response.status(400).json({ message: 'There was an error creating the training exercise', error: error.message });
        }
    }

    // Affichage de tous les exercices d'un training avec gestion d'erreur
    public async index({ params, response }: HttpContextContract) {
        try {


            const trainingExercices = await TrainingExercice.query().where('training_id', params.trainingId);

            return response.json(trainingExercices);


        } catch (error) {
            return response.status(404).json({ message: 'Training not found' });
        }
    }

    // Affichage d'un exercice d'un training avec gestion d'erreur
    public async show({ params, response }: HttpContextContract) {
        try {

            const trainingExercice = await TrainingExercice.findOrFail(params.exerciseId);

            return response.json(trainingExercice);

        } catch (error) {
            return response.status(404).json({ message: 'Training exercise not found' });
        }
    }

    // Mise à jour d'un exercice d'un training avec gestion d'erreur
    public async update({ auth, params, request, response }: HttpContextContract) {

            assert(auth.user, 'User not found');

            const payload = await request.validate(ExerciceUpdateValidator);

            const trainingExercice = await TrainingExercice.findOrFail(params.exerciseId);

            await trainingExercice.merge(payload as Partial<TrainingExercice>).save();

            return response.ok(trainingExercice);


    }

}
