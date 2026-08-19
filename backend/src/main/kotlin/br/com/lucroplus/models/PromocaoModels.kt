package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class PromocaoDto(
    val id: Long,
    val descontoPct: Int,
    val motivo: String,
    val status: String = "SUGESTAO",
    val dataSugestao: String,
    val dataAtivacao: String? = null,
    val produto: ProdutoDto
)
