/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
// start/routes.ts

Route.group(() => {
    Route.get('/', async () => {
        // Default page
        return { hello: 'world' }
    })

    // Users logic
    Route.group(() => {
        Route.get('/me', 'AuthController.me')
        Route.get('/check', 'AuthController.check')
        Route.post('/register', 'AuthController.register').as('register')
        Route.get('/login', 'AuthController.showLoginForm')
        Route.post('/login', 'AuthController.login').as('login')
        Route.delete('/logout', 'AuthController.logout').as('logout').middleware('auth')
    }).prefix('auth')

    Route.group(() => {
        Route.get('/me', 'UsersController.me')
        Route.put('/update', 'UsersController.update')
    })
        .prefix('users')
        .middleware('auth')

    Route.group(() => {
        Route.post('/', 'TrainingsController.create').as('create_training')
        Route.get('/', 'TrainingsController.index').as('trainings')
        Route.get('/:id', 'TrainingsController.show')
        Route.put('/:id', 'TrainingsController.update')
        Route.delete('/:id', 'TrainingsController.delete')

        Route.post('/:trainingId/exercises', 'TrainingsController.attach')
        Route.delete('/:trainingId/exercises', 'TrainingsController.detach')
        Route.get('/:trainingId/exercises', 'TrainingsController.showExercises')

        Route.post('/:trainingId/exercises/:exerciseId', 'ExercisesDetailsController.create')
        Route.get('/:trainingId/exercises/:exerciseId', 'ExercisesDetailsController.show')
        Route.put('/:trainingId/exercises/:exerciseId', 'ExercisesDetailsController.update')
        Route.delete('/:trainingId/exercises/:exerciseId', 'ExercisesDetailsController.destroy')
    })
        .prefix('trainings')
        .middleware('auth')

    Route.group(() => {
        Route.post('/', 'ExercisesController.create').as('create_exercise')
        Route.get('/', 'ExercisesController.index').as('exercises')
        Route.get('/:id', 'ExercisesController.show')
        Route.put('/:id', 'ExercisesController.update')
        // Route.delete('/:id', 'ExercisesController.delete')
    })
        .prefix('exercises')
        .middleware('auth')
}).prefix('api/v1/')
