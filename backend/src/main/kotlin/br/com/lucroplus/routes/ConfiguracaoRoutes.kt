package br.com.lucroplus.routes

import br.com.lucroplus.models.ErrorResponse
import br.com.lucroplus.models.MessageResponse
import br.com.lucroplus.models.PdvConfigDto
import br.com.lucroplus.services.ConfiguracaoService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.configuracaoRoutes() {
    route("/configuracoes") {
        get("/pdv") {
            val config = ConfiguracaoService.obterPdvConfig()
            call.respond(HttpStatusCode.OK, config)
        }

        post("/pdv") {
            val config = try {
                call.receive<PdvConfigDto>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Parâmetros de configuração inválidos"))
                return@post
            }

            ConfiguracaoService.salvarPdvConfig(config)
            call.respond(HttpStatusCode.OK, MessageResponse("Configurações salvas com sucesso!"))
        }

        post("/pdv/testar-conexao") {
            val config = try {
                call.receive<PdvConfigDto>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Parâmetros de teste inválidos"))
                return@post
            }

            val resultado = ConfiguracaoService.testarConexao(config)
            call.respond(HttpStatusCode.OK, resultado)
        }
    }
}
