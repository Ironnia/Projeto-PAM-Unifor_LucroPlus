package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class HealthResponse(
    val status: String,
    val mensagem: String,
    val versao: String = "1.0.0"
)

@Serializable
data class ErrorResponse(
    val erro: String,
    val detalhe: String? = null
)

@Serializable
data class MessageResponse(
    val mensagem: String,
    val sucesso: Boolean = true
)
