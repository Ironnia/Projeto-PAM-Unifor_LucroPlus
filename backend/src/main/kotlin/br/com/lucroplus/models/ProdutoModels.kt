package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class ProdutoDto(
    val id: Long,
    val nome: String,
    val descricao: String? = null,
    val preco: Double,
    val categoria: String,
    val ativo: Boolean = true
)

@Serializable
data class RentabilidadeDto(
    val produtoId: Long,
    val produtoNome: String,
    val precoVenda: Double,
    val custoProducao: Double,
    val lucroBruto: Double,
    val margemLucroPct: Double
)
