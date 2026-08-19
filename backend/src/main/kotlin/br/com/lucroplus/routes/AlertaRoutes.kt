package br.com.lucroplus.routes

import br.com.lucroplus.models.ErrorResponse
import br.com.lucroplus.models.MessageResponse
import br.com.lucroplus.services.AlertaService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.alertaRoutes() {
    route("/alertas") {
        get("/vencimento") {
            val alertas = AlertaService.obterAlertasVencimento()
            call.respond(HttpStatusCode.OK, alertas)
        }

        patch("/{id}/visualizar") {
            val idParam = call.parameters["id"]?.toLongOrNull()
            if (idParam == null) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("ID de alerta inválido"))
                return@patch
            }

            val sucesso = AlertaService.marcarComoVisualizado(idParam)
            if (sucesso) {
                call.respond(HttpStatusCode.OK, MessageResponse("Alerta marcado como visualizado"))
            } else {
                call.respond(HttpStatusCode.NotFound, ErrorResponse("Alerta não encontrado"))
            }
        }
    }
}
