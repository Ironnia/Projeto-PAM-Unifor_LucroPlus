package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class ErroImportacaoDto(
    val linha: Int,
    val campo: String,
    val valorRecebido: String,
    val motivo: String
)

@Serializable
data class ImportacaoResponse(
    val sucesso: Boolean,
    val mensagem: String,
    val totalLinhas: Int,
    val linhasSucesso: Int,
    val linhasErro: Int,
    val erros: List<ErroImportacaoDto> = emptyList()
)
