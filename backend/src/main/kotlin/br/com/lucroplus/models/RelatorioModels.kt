package br.com.lucroplus.models

import kotlinx.serialization.Serializable

@Serializable
data class DesperdicioIngredienteDto(
    val ingrediente: String,
    val quantidadePerdida: Double,
    val unidade: String,
    val valorPerdidoRs: Double
)

@Serializable
data class DesperdicioHistoricoDto(
    val mesAno: String,
    val valorPerdidoRs: Double
)
