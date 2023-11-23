/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
    protected statusPages = {
        '403': 'errors/unauthorized',
        '404': 'errors/not-found',
        '500..599': 'errors/server-error',
    }

    constructor() {
        super(Logger)
    }

    // Gestion d'erreur
    public async handle(error, ctx) {

        console.log(error.code);
        // Unauthorized
        if (error.code === "E_UNAUTHORIZED_ACCESS") {
            return ctx.response.unauthorized({
                status: 401,
                path: ctx.request.url(),
                code: "E_UNAUTHORIZED_ACCESS",
                message: "You are not authorized to access this resource",
                detail: "Ensure that you have the correct permissions and try again"
            })
        }

        if (['E_INVALID_AUTH_UID', 'E_INVALID_AUTH_UID_PASSWORD', 'E_INVALID_AUTH_PASSWORD'].includes(error.code)) {
            return ctx.response.badRequest({
                code: "E_INVALID_CREDENTIALS",
                message: "No account can be found with the provided credentials"
            })
        }

        // Si l'erreur est de type ValidationException, on retourne une erreur 422 avec le message de validation
        if (error.code === "E_VALIDATION_FAILURE") {
            return ctx.response.unprocessableEntity({
                status: 422,
                path: ctx.request.url(),
                code: "E_VALIDATION_FAILURE",
                message: "Validation error",
                errors: error.messages
            })
        }

        if(
            (error.code === "E_AUTHORIZATION_FAILURE" && error.status === 404) ||
            error.code === "E_ROW_NOT_FOUND"
        ) {
            return ctx.response.notFound({
                status: 404,
                path: ctx.request.url(),
                code: "E_RESOURCE_NOT_FOUND",
                message: "The requested resource was not found",
                detail: "Ensure that the resource exists and that you have the correct permissions to access it"
            })
        }

        if (error.code === "E_ROUTE_NOT_FOUND") {
            return ctx.response.notFound({
                status: 404,
                path: ctx.request.url(),
                code: "E_ROUTE_NOT_FOUND",
                message: "The requested route was not found",
                detail: "Ensure that the route exists"
            })
        }

        // Certaines erreurs sont gérées par AdonisJS nativement et on appel donc leur méthode handle pour gérer l'erreur
        if (typeof error.handle === "function") {
            return error.handle(error, ctx)
        }

        return ctx.response.notFound({
            status: 500,
            path: ctx.request.url(),
            code: "E_INTERNAL_SERVER_ERROR",
            message: "An internal server error occurred",
        })


    }

    // public async report(error, ctx) {
    //
    //     if (this.shouldReport(error) && Application.inDev) {
    //         console.error(error)
    //         return
    //     }
    //
    //     if (!this.shouldReport(error) || !Application.inProduction) {
    //         return
    //     }
    //
    //
    // }

}
