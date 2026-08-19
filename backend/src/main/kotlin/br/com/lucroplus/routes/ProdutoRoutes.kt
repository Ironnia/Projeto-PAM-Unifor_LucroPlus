package br.com.lucroplus.routes

import br.com.lucroplus.services.ProdutoService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.produtoRoutes() {
    route("/produtos") {
        get {
            val produtos = ProdutoService.listarProdutos()
            call.respond(HttpStatusCode.OK, produtos)
        }

        get("/rentabilidade") {
            val rentabilidade = ProdutoService.obterRentabilidadeProdutos()
            call.respond(HttpStatusCode.OK, rentabilidade)
        }
    }
}
