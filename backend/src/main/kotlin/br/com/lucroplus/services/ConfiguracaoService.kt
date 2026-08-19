package br.com.lucroplus.services

import br.com.lucroplus.database.ConfiguracoesTable
import br.com.lucroplus.database.DatabaseFactory.dbQuery
import br.com.lucroplus.models.PdvConfigDto
import br.com.lucroplus.models.TestarConexaoResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.upsert
import java.sql.DriverManager

object ConfiguracaoService {

    suspend fun obterPdvConfig(): PdvConfigDto = dbQuery {
        val configs = ConfiguracoesTable
            .selectAll()
            .associate { it[ConfiguracoesTable.chave] to (it[ConfiguracoesTable.valor] ?: "") }

        val url = configs["pdv_url"]?.ifBlank { null }
            ?: "jdbc:mysql://localhost:3306/pdv_ficticio?serverTimezone=UTC&useSSL=false&allowPublicKeyRetrieval=true"
        val username = configs["pdv_username"]?.ifBlank { null } ?: "root"
        val password = configs["pdv_password"] ?: ""

        PdvConfigDto(
            url = url,
            username = username,
            password = password
        )
    }

    suspend fun salvarPdvConfig(config: PdvConfigDto): Unit = dbQuery {
        ConfiguracoesTable.upsert {
            it[chave] = "pdv_url"
            it[valor] = config.url
        }
        ConfiguracoesTable.upsert {
            it[chave] = "pdv_username"
            it[valor] = config.username
        }
        ConfiguracoesTable.upsert {
            it[chave] = "pdv_password"
            it[valor] = config.password ?: ""
        }
    }

    suspend fun testarConexao(config: PdvConfigDto): TestarConexaoResponse = withContext(Dispatchers.IO) {
        try {
            DriverManager.setLoginTimeout(3)
            val connection = DriverManager.getConnection(config.url, config.username, config.password ?: "")
            val isValid = connection.isValid(2)
            connection.close()

            if (isValid) {
                TestarConexaoResponse(
                    sucesso = true,
                    mensagem = "Conexão JDBC estabelecida com sucesso! O banco do PDV está acessível."
                )
            } else {
                TestarConexaoResponse(
                    sucesso = false,
                    mensagem = "Não foi possível validar a conexão com o banco do PDV."
                )
            }
        } catch (e: Exception) {
            TestarConexaoResponse(
                sucesso = false,
                mensagem = "Erro ao conectar ao PDV: ${e.localizedMessage ?: "Verifique a URL e as credenciais."}"
            )
        }
    }
}
