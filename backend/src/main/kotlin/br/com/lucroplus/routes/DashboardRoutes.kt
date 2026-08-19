package br.com.lucroplus.routes

import br.com.lucroplus.services.DashboardService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.dashboardRoutes() {
    route("/dashboard") {
        get("/kpis") {
            val kpis = DashboardService.obterKpis()
            call.respond(HttpStatusCode.OK, kpis)
        }

        get("/vendas") {
            val dadosGraficos = DashboardService.obterDadosGraficos()
            call.respond(HttpStatusCode.OK, dadosGraficos)
        }

        get("/previsao") {
            val previsao = DashboardService.obterPrevisaoDemanda()
            call.respond(HttpStatusCode.OK, previsao)
        }
    }
}
