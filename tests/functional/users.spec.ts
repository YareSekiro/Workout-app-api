import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import UserFactory from '../../database/factories/UserFactory'
import TrainingFactory from '../../database/factories/TrainingFactory'
import ExerciseFactory from 'Database/factories/ExerciseFactory'

test.group('Users', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure we can get the current user', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.get('/api/v1/auth/me').loginAs(user)

        response.assertStatus(200)

        assert.equal(response.body().id, user.id)
    })

    test('ensure auth check return correct status when guest', async ({ client }) => {
        const response = await client.get('/api/v1/auth/check')

        response.assertStatus(200)

        return response.assertBodyContains({ authenticated: false })
    })

    test('ensure auth check return correct status when auth', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.get('/api/v1/auth/check').loginAs(user)

        response.assertStatus(200)

        return response.assertBodyContains({ authenticated: true })
    })
})
test.group('Users - Login / Logout', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that we can log out', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.delete('/api/v1/auth/logout').loginAs(user)

        response.assertStatus(204)
    })

    test('ensure that we cannot log out when guest', async ({ client }) => {
        const response = await client.delete('/api/v1/auth/logout')

        console.log(response.body())

        response.assertStatus(401)

        response.assertBodyContains({
            status: 401,
            path: '/api/v1/auth/logout',
            code: 'E_UNAUTHORIZED_ACCESS',
            message: 'You are not authorized to access this resource',
            detail: 'Ensure that you have the correct permissions and try again',
        })
    })

    test('ensure that we can log in', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.post('/api/v1/auth/login').json({
            email: user.email,
            password: 'secret1234',
        })

        response.assertStatus(204)
    })

    test('ensure that we cannot login with invalid email', async ({ client }) => {
        // @ts-ignore
        const user = await UserFactory.create()

        const response = await client.post('/api/v1/auth/login').json({
            email: 'az@example.com',
            password: 'secret1234',
        })

        response.assertStatus(400)
        response.assertBodyContains({
            code: 'E_INVALID_CREDENTIALS',
            message: 'No account can be found with the provided credentials',
        })
    })

    test('ensure that we cannot login with invalid password', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.post('/api/v1/auth/login').json({
            email: user.email,
            password: 'secret12345',
        })

        response.assertStatus(400)
        response.assertBodyContains({
            code: 'E_INVALID_CREDENTIALS',
            message: 'No account can be found with the provided credentials',
        })
    })
})
test.group('Users | Register', (group) => {
    // Pour s'assurer que la db rollback après chaque test et ainsi ne pas avoir des problèmes
    // de données créer par les tests
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure user can register', async ({ client }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'ad.remondini',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })

        response.assertStatus(201)
    })

    test('ensure user cannot register with existing email', async ({ client }) => {
        // Given I have a user with email ad.remondini@example.com
        await UserFactory.merge({ email: 'ad.remondini@example.com' }).create()
        // When I try to register with the same email
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'ad.remondini',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })
        // Then I should get an error
        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                email: ['Cette adresse email est déjà utilisée'],
            },
        })
    })

    test('ensure user cannot register with invalid email', async ({ client }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini',
            username: 'JunMoXiang',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                email: ["L'adresse email doit être valide"],
            },
        })
    })

    test('ensure user cannot register with email longer than 255 characters', async ({
        client,
    }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: `${Array(256).fill('a').join('')}@example.com`,
            username: 'JunMoXiang',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                email: ["L'adresse email doit contenir au plus 255 caractères"],
            },
        })
    })

    test('ensure user cannot register with existing username', async ({ client }) => {
        // Given I have a user with email ad.remondini@example.com
        await UserFactory.merge({ username: 'ad.remondini' }).create()
        // When I try to register with the same email
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'ad.remondini',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })
        // Then I should get an error
        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                username: ["Ce nom d'utilisateur est déjà utilisé"],
            },
        })
    })

    test('ensure user cannot register with username shorter than 4 characters', async ({
        client,
    }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'JMX',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                username: ["Le nom d'utilisateur doit contenir au moins 4 caractères"],
            },
        })
    })

    test('ensure user cannot register with username longer than 25 characters', async ({
        client,
    }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'JunMoXiangJunMoXiangJunMoXiang',
            password: 'secret1234',
            password_confirmation: 'secret1234',
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                username: ["Le nom d'utilisateur doit contenir au plus 25 caractères"],
            },
        })
    })

    test('ensure user cannot register with password shorter than 8 characters', async ({
        client,
    }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'ad.remondini',
            password: 'secret',
            password_confirmation: 'secret',
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                password: ['Le mot de passe doit contenir au moins 8 caractères'],
            },
        })
    })

    test('ensure user cannot register with password longer than 180 characters', async ({
        client,
    }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'ad.remondini',
            password: `${Array(181).fill('a').join('')}`,
            password_confirmation: `${Array(181).fill('a').join('')}`,
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                password: ['Le mot de passe doit contenir au plus 180 caractères'],
            },
        })
    })

    test('ensure user cannot register with password that does not match', async ({ client }) => {
        const response = await client.post('/api/v1/auth/register').json({
            email: 'ad.remondini@example.com',
            username: 'ad.remondini',
            password: 'secret1234',
            password_confirmation: 'secret12345',
        })

        response.assertStatus(422)
        response.assertBodyContains({
            status: 422,
            path: '/api/v1/auth/register',
            code: 'E_VALIDATION_FAILURE',
            message: 'Validation error',
            errors: {
                password_confirmation: ['Les mots de passe ne correspondent pas'],
            },
        })
    })
})
test.group('Trainings | Create', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that we can create a workout', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const response = await client.post('/api/v1/trainings').loginAs(user).json({
            name: 'My workout',
        })

        response.assertStatus(201)

        assert.equal(response.body().name, 'My workout')
    })

    test('ensure that unauthenticated user cannot create a workout', async ({ client }) => {
        const response = await client.post('/api/v1/trainings').json({
            name: 'My workout',
        })

        response.assertStatus(401)
        response.assertBodyContains({
            status: 401,
            path: '/api/v1/trainings',
            code: 'E_UNAUTHORIZED_ACCESS',
            message: 'You are not authorized to access this resource',
            detail: 'Ensure that you have the correct permissions and try again',
        })
    })
})
test.group('Trainings | Index / Show', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that a user can get all of his workouts', async ({ assert, client }) => {
        const user = await UserFactory.create()

        await TrainingFactory.merge({ userId: user.id }).createMany(3)

        const response = await client.get('/api/v1/trainings').loginAs(user)

        response.assertStatus(200)

        assert.equal(response.body().length, 3)
    })

    test('ensure unauthenticated user can not get all workouts', async ({ client }) => {
        await TrainingFactory.createMany(3)

        const response = await client.get('/api/v1/trainings')

        response.assertStatus(401)

        response.assertBodyContains({
            status: 401,
            path: '/api/v1/trainings',
            code: 'E_UNAUTHORIZED_ACCESS',
            message: 'You are not authorized to access this resource',
            detail: 'Ensure that you have the correct permissions and try again',
        })
    })

    test('ensure that a user can get one of his workout', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.merge({ userId: user.id }).create()

        const response = await client.get(`/api/v1/trainings/${training.id}`).loginAs(user)

        response.assertStatus(200)

        assert.equal(response.body().id, training.id)
    })

    test('ensure unauthenticated user can not get a workout', async ({ client }) => {
        const training = await TrainingFactory.create()

        const response = await client.get(`/api/v1/trainings/${training.id}`)

        response.assertStatus(401)

        response.assertBodyContains({
            status: 401,
            path: `/api/v1/trainings/${training.id}`,
            code: 'E_UNAUTHORIZED_ACCESS',
            message: 'You are not authorized to access this resource',
            detail: 'Ensure that you have the correct permissions and try again',
        })
    })

    test('ensure that an authenticated user can not get a workout that does not belong to him', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.create()

        const response = await client.get(`/api/v1/trainings/${training.id}`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/${training.id}`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that an authenticated user can not get a workout that does not exist', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const response = await client.get(`/api/v1/trainings/999`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/999`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that an authenticated user can not get a workout with an invalid id', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const response = await client.get(`/api/v1/trainings/invalid`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/invalid`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })
    // Not sur if this test is really helpful, it might be auto handled by Adonis
    test('ensure that an authenticated user can not get a workout with a SQL injection', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const response = await client.get(`/api/v1/trainings/1 OR 1=1`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/1%20OR%201=1`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })
})
test.group('Trainings | Update / Delete', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that a user can update one of his workout', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.merge({ userId: user.id }).create()

        const response = await client.put(`/api/v1/trainings/${training.id}`).loginAs(user).json({
            name: 'My workout',
        })

        response.assertStatus(200)

        assert.equal(response.body().name, 'My workout')
    })

    test('ensure that a user can not update a workout that does not belong to him', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.create()

        const response = await client.put(`/api/v1/trainings/${training.id}`).loginAs(user).json({
            name: 'My workout',
        })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/${training.id}`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can not update a workout that does not exist', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.put(`/api/v1/trainings/999`).loginAs(user).json({
            name: 'My workout',
        })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/999`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can not update a workout with an invalid id', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.put(`/api/v1/trainings/invalid`).loginAs(user).json({
            name: 'My workout',
        })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/invalid`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can not update a workout with a SQL injection', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.put(`/api/v1/trainings/1 OR 1=1`).loginAs(user).json({
            name: 'My workout',
        })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/1%20OR%201=1`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can delete one of his workout', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.merge({ userId: user.id }).create()

        const response = await client.delete(`/api/v1/trainings/${training.id}`).loginAs(user)

        response.assertStatus(200)

        assert.equal(response.body().id, training.id)
    })

    test('ensure that a user can not delete a workout that does not belong to him', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.create()

        const response = await client.delete(`/api/v1/trainings/${training.id}`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/${training.id}`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can not delete a workout that does not exist', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/v1/trainings/999`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/999`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can not delete a workout with an invalid id', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/v1/trainings/invalid`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/invalid`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can not delete a workout with a SQL injection', async ({ client }) => {
        const user = await UserFactory.create()

        const response = await client.delete(`/api/v1/trainings/1 OR 1=1`).loginAs(user)

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/1%20OR%201=1`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })
})
test.group('Trainings | Attach / Detach', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that a user can attach an exercise to one of his workout', async ({
        assert,
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.merge({ userId: user.id }).create()

        const exercise = await ExerciseFactory.create()

        const response = await client
            .post(`/api/v1/trainings/${training.id}/exercises`)
            .loginAs(user)
            .json({
                exerciseId: exercise.id,
                totalSets: 4,
            })

        response.assertStatus(200)

        assert.equal(response.body().id, training.id)
    })

    test('ensure that a user can not attach an exercise to a workout that does not belong to him', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.create()

        const exercise = await ExerciseFactory.create()

        const response = await client
            .post(`/api/v1/trainings/${training.id}/exercises`)
            .loginAs(user)
            .json({
                exerciseId: exercise.id,
                totalSets: 4,
            })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/${training.id}/exercises`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })

    test('ensure that a user can detach an exercise to one of his workout', async ({
        assert,
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.merge({ userId: user.id }).create()

        const exercise = await ExerciseFactory.create()

        await training.related('exercises').attach({
            [exercise.id]: {
                total_sets: 4,
            },
        })

        const response = await client
            .delete(`/api/v1/trainings/${training.id}/exercises`)
            .loginAs(user)
            .json({
                exerciseId: exercise.id,
            })

        response.assertStatus(200)

        assert.equal(response.body().id, training.id)
    })

    test('ensure that a user can not detach an exercise to a workout that does not belong to him', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.create()

        const exercise = await ExerciseFactory.create()

        await training.related('exercises').attach({
            [exercise.id]: {
                total_sets: 4,
            },
        })

        const response = await client
            .delete(`/api/v1/trainings/${training.id}/exercises`)
            .loginAs(user)
            .json({
                exerciseId: exercise.id,
            })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/${training.id}/exercises`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })
})

test.group('Exercises | Index / Show', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that a user can get all exercises', async ({ assert, client }) => {
        const user = await UserFactory.create()

        await ExerciseFactory.createMany(2)

        const response = await client.get('/api/v1/exercises').loginAs(user)

        response.assertStatus(200)

        assert.equal(response.body().length, 3)
    })

    test('ensure that a user unauthorized cant get all exercises', async ({ client }) => {
        await ExerciseFactory.createMany(3)

        const response = await client.get('/api/v1/exercises')

        response.assertStatus(401)

        response.assertBodyContains({
            status: 401,
            path: '/api/v1/exercises',
            code: 'E_UNAUTHORIZED_ACCESS',
            message: 'You are not authorized to access this resource',
            detail: 'Ensure that you have the correct permissions and try again',
        })
    })

    test('ensure that a user can get one exercise', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const exercise = await ExerciseFactory.create()

        const response = await client.get(`/api/v1/exercises/${exercise.id}`).loginAs(user)

        response.assertStatus(200)

        assert.equal(response.body().id, exercise.id)
    })

    test('ensure a user unauthorized cant get one exercise', async ({ client }) => {
        const exercise = await ExerciseFactory.create()

        const response = await client.get(`/api/v1/exercises/${exercise.id}`)

        response.assertStatus(401)

        response.assertBodyContains({
            status: 401,
            path: `/api/v1/exercises/${exercise.id}`,
            code: 'E_UNAUTHORIZED_ACCESS',
            message: 'You are not authorized to access this resource',
            detail: 'Ensure that you have the correct permissions and try again',
        })
    })
})

test.group('Exercises Details | Create', (group) => {
    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
    })

    test('ensure that a user can create an exercise detail', async ({ assert, client }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.merge({ userId: user.id }).create()

        const exercise = await ExerciseFactory.create()

        await training.related('exercises').attach({
            [exercise.id]: {
                total_sets: 4,
            },
        })

        const response = await client
            .post(`/api/v1/trainings/${training.id}/exercises/${exercise.id}`)
            .loginAs(user)
            .json({
                setNumber: 1,
                reps: 10,
                weight: 10,
                restTime: 60,
            })

        response.assertStatus(201)

        assert.equal(response.body().training_exercise_id, training.id)
    })

    test('ensure that a user can not create an exercise detail for a training that does not belong to him', async ({
        client,
    }) => {
        const user = await UserFactory.create()

        const training = await TrainingFactory.create()

        const exercise = await ExerciseFactory.create()

        await training.related('exercises').attach({
            [exercise.id]: {
                total_sets: 4,
            },
        })

        const response = await client
            .post(`/api/v1/trainings/${training.id}/exercises/${exercise.id}`)
            .loginAs(user)
            .json({
                setNumber: 1,
                reps: 10,
                weight: 10,
                restTime: 60,
            })

        response.assertStatus(404)

        response.assertBodyContains({
            status: 404,
            path: `/api/v1/trainings/${training.id}/exercises/${exercise.id}`,
            code: 'E_RESOURCE_NOT_FOUND',
            message: 'The requested resource was not found',
            detail: 'Ensure that the resource exists and that you have the correct permissions to access it',
        })
    })
})
