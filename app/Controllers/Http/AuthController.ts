import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'
import CreateUserValidator from '../../Validators/CreateUserValidator'


export default class AuthController {

      public showLoginForm({ view }: HttpContextContract) {
            return view.render('auth/login');
      }



      public me({ auth }: HttpContextContract) {
          return auth.user;
      }

      public async check({ auth, response }: HttpContextContract) {
          return response.ok({authenticated: auth.isAuthenticated});
      }

      public async login({ auth, request, response }: HttpContextContract) {
            const { email, password } = request.all();
            await auth.attempt(email, password);
            return response.redirect("/api/v1/trainings");
      }

      public async register({auth,  request, response }: HttpContextContract) {
            const  payload = await request.validate(CreateUserValidator);
            // @ts-ignore
            const user = await User.create(payload);

            await auth.login(user);

            return response.created();

      }

      public async logout({ auth, response }: HttpContextContract) {
            await auth.logout();
            return response.noContent();
      }

}
