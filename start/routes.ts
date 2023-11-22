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

    // Users logic
    Route.group(() => {

        Route.get("/me", "AuthController.me");
        Route.get("/check", "AuthController.check");
        Route.post('/register', 'AuthController.register').as('register');
        Route.get('/login', 'AuthController.showLoginForm');
        Route.post('/login', 'AuthController.login').as('login');
        Route.get('/logout', 'AuthController.logout').as('logout').middleware('auth');

    }).prefix('auth');

    Route.group(() => {

        Route.get('/me', 'UsersController.me');
        Route.put('/update', 'UsersController.update');

    }).prefix('users').middleware('auth');

    Route.group(() => {

        Route.post('/', 'TrainingsController.create').as('create_training');
        Route.get('/create', 'TrainingsController.showForm');
        Route.get('/', 'TrainingsController.index').as('trainings');
        Route.get('/:id', 'TrainingsController.show');
        Route.put('/:id', 'TrainingsController.update');
        Route.delete('/:id', 'TrainingsController.delete');



        Route.post('/:trainingId/exercises', 'TrainingExercicesController.create');
        Route.get('/:trainingId/exercises', 'TrainingExercicesController.index');
        Route.get('/:trainingId/exercises/:exerciseId', 'TrainingExercicesController.show');
        Route.put('/:trainingId/exercises/:exerciseId', 'TrainingExercicesController.update');
        Route.delete('/:trainingId/exercises/:exerciseId', 'TrainingExercicesController.delete');



    }).prefix('trainings').middleware('auth');


}).prefix('api/v1/');
