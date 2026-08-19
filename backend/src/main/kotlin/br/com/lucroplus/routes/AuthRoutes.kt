package br.com.lucroplus.routes

import br.com.lucroplus.database.DatabaseFactory.dbQuery
import br.com.lucroplus.database.UsuariosTable
import br.com.lucroplus.models.ErrorResponse
import br.com.lucroplus.models.LoginRequest
import br.com.lucroplus.models.LoginResponse
import br.com.lucroplus.security.JwtConfig
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.selectAll
import org.mindrot.jbcrypt.BCrypt

fun Route.authRoutes() {
    route("/auth") {

        post("/login") {
            val request = try {
                call.receive<LoginRequest>()
            } catch (e: Exception) {
                call.respond(HttpStatusCode.BadRequest, ErrorResponse("Formato de requisição inválido"))
                return@post
            }

            val usuario = dbQuery {
                UsuariosTable
                    .selectAll()
                    .where { (UsuariosTable.email eq request.email) and (UsuariosTable.ativo eq true) }
                    .singleOrNull()
            }

            val senhaValida = usuario != null && (
                usuario[UsuariosTable.senhaHash] == request.senha ||
                try { BCrypt.checkpw(request.senha, usuario[UsuariosTable.senhaHash]) } catch (e: Exception) { false }
            )

            if (usuario == null || !senhaValida) {
                call.respond(
                    HttpStatusCode.Unauthorized,
                    ErrorResponse("Email ou senha inválidos")
                )
                return@post
            }

            val id = usuario[UsuariosTable.id]
            val nome = usuario[UsuariosTable.nome]
            val email = usuario[UsuariosTable.email]
            val tipo = usuario[UsuariosTable.tipo]

            val token = JwtConfig.generateToken(id, email, tipo, nome)

            call.respond(
                HttpStatusCode.OK,
                LoginResponse(
                    token = token,
                    expiresIn = 28800L,
                    nome = nome,
                    email = email,
                    tipo = tipo
                )
            )
        }

        authenticate("auth-jwt") {
            get("/me") {
                val principal = call.principal<JWTPrincipal>()
                if (principal == null) {
                    call.respond(HttpStatusCode.Unauthorized, ErrorResponse("Token inválido ou não informado"))
                    return@get
                }

                val nome = principal.payload.getClaim("nome").asString() ?: "Usuário"
                val email = principal.payload.getClaim("email").asString() ?: ""
                val tipo = principal.payload.getClaim("tipo").asString() ?: "GERENTE"

                call.respond(
                    HttpStatusCode.OK,
                    LoginResponse(
                        token = null,
                        expiresIn = null,
                        nome = nome,
                        email = email,
                        tipo = tipo
                    )
                )
            }
        }
    }
}
