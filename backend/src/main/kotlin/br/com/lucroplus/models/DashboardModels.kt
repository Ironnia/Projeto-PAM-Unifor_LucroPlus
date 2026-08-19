package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class DashboardKpisDto(
    val faturamentoTotal: Double,
    val totalPedidos: Int,
    val totalProdutosVendidos: Int,
    val ticketMedio: Double
)

@Serializable
data class FaturamentoDiarioDto(
    val dataVenda: String,
    val faturamento: Double,
    val totalPedidos: Int
)

@Serializable
data class ProdutoRankingDto(
    val id: Long,
    val nome: String,
    val totalVendido: Int,
    val receitaTotal: Double
)

@Serializable
data class DashboardVendasResponse(
    val faturamentoDiario: List<FaturamentoDiarioDto>,
    val top5Produtos: List<ProdutoRankingDto>,
    val produtosBaixoGiro: List<ProdutoRankingDto>
)

@Serializable
data class PrevisaoDemandaDto(
    val produtoId: Long,
    val produtoNome: String,
    val diaSemana: Int,
    val totalVendidoPeriodo: Int,
    val mediaVendasEsperada: Double
)
