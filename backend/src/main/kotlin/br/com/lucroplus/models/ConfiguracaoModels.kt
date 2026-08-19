package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class PdvConfigDto(
    val url: String,
    val username: String,
    val password: String? = null
)

@Serializable
data class TestarConexaoResponse(
    val sucesso: Boolean,
    val mensagem: String
)
