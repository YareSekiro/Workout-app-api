import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Training from '../../Models/Training';
import { assert } from '../../utils';

export default class TrainingsController {

    // Affichage du formulaire de création d'un entraînement
    public showForm({ view }: HttpContextContract) {
        return view.render('training/training');
    }

    // Creation d'un entraînement
    public async create({ auth, request, response }: HttpContextContract) {

        const { name } = request.all();

        await Training.create({
            name,
            userId: auth.user?.id
        });

        return response.json({ name });

    }

    // Affichage de tous les entraînements
    public async index({ auth, response }: HttpContextContract) {

        assert(auth.user, 'User not found');

        const trainings = await Training.query().where('user_id', auth.user?.id);

        return response.ok(trainings);

    }

    // Affichage d'un entraînement
    public async show({ auth, params, response }: HttpContextContract) {

        assert(auth.user, 'User not found');

            const training = await Training.query()
                .where('user_id', auth.user?.id)
                .andWhere('id', params.id)
                .preload('trainingExercices')
                .firstOrFail();

            return response.ok(training);
    }

    // Modification d'un entraînement
    public async update({ auth, params, request, response }: HttpContextContract) {

        assert(auth.user, 'User not found');

        const { name } = request.all();

        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.id)
            .firstOrFail();

        await training.merge({ name }).save();

        return response.ok(training);

    }

    // Suppression d'un entraînement
    public async delete({ auth, params, response }: HttpContextContract) {

        assert(auth.user, 'User not found');


        const training = await Training.query()
            .where('user_id', auth.user?.id)
            .andWhere('id', params.id)
            .firstOrFail();

        await training.delete();

        return response.ok(training);

    }

}
