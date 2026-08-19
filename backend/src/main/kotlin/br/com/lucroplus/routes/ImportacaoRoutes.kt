package br.com.lucroplus.routes

import br.com.lucroplus.models.ErrorResponse
import br.com.lucroplus.models.ImportacaoResponse
import br.com.lucroplus.services.ImportacaoService
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.importacaoRoutes() {
    route("/importacao") {
        post("/produtos") {
            val csvText = call.extrairConteudoCsv()
            if (csvText == null) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Nenhum arquivo CSV foi enviado"))
                return@post
            }

            val resultado = ImportacaoService.importarProdutos(csvText)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/ingredientes") {
            val csvText = call.extrairConteudoCsv()
            if (csvText == null) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Nenhum arquivo CSV foi enviado"))
                return@post
            }

            val resultado = ImportacaoService.importarIngredientes(csvText)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/ficha-tecnica") {
            val csvText = call.extrairConteudoCsv()
            if (csvText == null) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Nenhum arquivo CSV foi enviado"))
                return@post
            }

            val resultado = ImportacaoService.importarFichaTecnica(csvText)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/vendas") {
            val csvText = call.extrairConteudoCsv()
            if (csvText == null) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Nenhum arquivo CSV foi enviado"))
                return@post
            }

            val resultado = ImportacaoService.importarVendas(csvText)
            call.respond(HttpStatusCode.OK, resultado)
        }

        post("/pdv") {
            val resultado = ImportacaoService.sincronizarPdv()
            call.respond(HttpStatusCode.OK, resultado)
        }
    }
}

private suspend fun ApplicationCall.extrairConteudoCsv(): String? {
    val contentType = request.contentType()
    return if (contentType.match(ContentType.MultiPart.FormData)) {
        try {
            val multipart = receiveMultipart()
            var conteudo: String? = null
            multipart.forEachPart { part ->
                if (part is PartData.FileItem) {
                    conteudo = part.streamProvider().readBytes().toString(Charsets.UTF_8)
                } else if (part is PartData.FormItem) {
                    conteudo = part.value
                }
                part.dispose()
            }
            conteudo
        } catch (e: Exception) {
            null
        }
    } else {
        try {
            val text = receiveText()
            if (text.isNotBlank()) text else null
        } catch (e: Exception) {
            null
        }
    }
}
