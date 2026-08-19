package br.com.lucroplus.routes

import br.com.lucroplus.services.RelatorioService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.relatorioRoutes() {
    route("/relatorios") {
        get("/desperdicio") {
            val desperdicio = RelatorioService.obterDesperdicioMesAtual()
            call.respond(HttpStatusCode.OK, desperdicio)
        }

        get("/historico") {
            val historico = RelatorioService.obterHistoricoDesperdicio()
            call.respond(HttpStatusCode.OK, historico)
        }
    }
}
