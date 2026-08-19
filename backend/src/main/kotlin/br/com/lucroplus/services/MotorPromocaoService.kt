package br.com.lucroplus.services

import br.com.lucroplus.database.*
import br.com.lucroplus.database.DatabaseFactory.dbQuery
import br.com.lucroplus.models.ProdutoDto
import br.com.lucroplus.models.PromocaoDto
import kotlinx.datetime.toKotlinLocalDate
import org.jetbrains.exposed.sql.*
import java.time.DayOfWeek
import java.time.LocalDate
import java.time.temporal.ChronoUnit

object MotorPromocaoService {

    suspend fun listarSugestoes(): List<PromocaoDto> = dbQuery {
        val hojeJava = LocalDate.now()
        val dataLimiteJava = hojeJava.plusDays(5)
        val data7DiasAtrasJava = hojeJava.minusDays(7)

        val hojeKmp = hojeJava.toKotlinLocalDate()
        val dataLimiteKmp = dataLimiteJava.toKotlinLocalDate()
        val data7DiasAtrasKmp = data7DiasAtrasJava.toKotlinLocalDate()

        val lotesEmRisco = (LotesTable innerJoin IngredientesTable)
            .selectAll()
            .where { (LotesTable.dataValidade greaterEq hojeKmp) and (LotesTable.dataValidade lessEq dataLimiteKmp) }
            .toList()

        for (loteRow in lotesEmRisco) {
            val ingredienteId = loteRow[LotesTable.ingredienteId]
            val ingredienteNome = loteRow[IngredientesTable.nome]
            val validadeKmp = loteRow[LotesTable.dataValidade]
            val validadeJava = LocalDate.parse(validadeKmp.toString())
            val numeroLote = loteRow[LotesTable.numeroLote] ?: "LOT-${loteRow[LotesTable.id]}"
            val diasParaVencer = ChronoUnit.DAYS.between(hojeJava, validadeJava).toInt().coerceAtLeast(0)

            val produtosAfetados = (FichasTecnicasTable innerJoin ProdutosTable)
                .selectAll()
                .where { (FichasTecnicasTable.ingredienteId eq ingredienteId) and (ProdutosTable.ativo eq true) }
                .toList()

            for (prodRow in produtosAfetados) {
                val produtoId = prodRow[ProdutosTable.id]

                val jaExiste = PromocoesTable
                    .selectAll()
                    .where { 
                        (PromocoesTable.produtoId eq produtoId) and 
                        ((PromocoesTable.status eq "SUGESTAO") or (PromocoesTable.status eq "ATIVA"))
                    }
                    .count() > 0

                if (!jaExiste) {
                    val melhorDia = obterMelhorDiaDaSemana(produtoId, data7DiasAtrasKmp)

                    // Regra de escalonamento de desconto por urgência de validade
                    val descontoPct = when {
                        diasParaVencer <= 1 -> 30
                        diasParaVencer == 2 -> 20
                        else -> 10
                    }

                    val infoDia = if (melhorDia != null) {
                        "Historicamente, ${melhorDia.nomeEmPortugues()} é o dia de maior saída."
                    } else {
                        "Recomendado ativar imediatamente para acelerar o escoamento."
                    }

                    val motivo = "Evitar desperdício de $ingredienteNome ($numeroLote) que vence em $diasParaVencer dia(s). $infoDia"

                    PromocoesTable.insert {
                        it[PromocoesTable.produtoId] = produtoId
                        it[PromocoesTable.descontoPct] = descontoPct
                        it[PromocoesTable.motivo] = motivo
                        it[PromocoesTable.status] = "SUGESTAO"
                        it[PromocoesTable.dataSugestao] = hojeKmp
                        it[PromocoesTable.dataAtivacao] = null
                    }
                }
            }
        }

        (PromocoesTable innerJoin ProdutosTable)
            .selectAll()
            .where { PromocoesTable.status eq "SUGESTAO" }
            .orderBy(PromocoesTable.id, SortOrder.DESC)
            .map { row ->
                PromocaoDto(
                    id = row[PromocoesTable.id],
                    descontoPct = row[PromocoesTable.descontoPct],
                    motivo = row[PromocoesTable.motivo],
                    status = row[PromocoesTable.status],
                    dataSugestao = row[PromocoesTable.dataSugestao].toString(),
                    dataAtivacao = row[PromocoesTable.dataAtivacao]?.toString(),
                    produto = ProdutoDto(
                        id = row[ProdutosTable.id],
                        nome = row[ProdutosTable.nome],
                        descricao = row[ProdutosTable.descricao],
                        preco = row[ProdutosTable.preco].toDouble(),
                        categoria = row[ProdutosTable.categoria],
                        ativo = row[ProdutosTable.ativo]
                    )
                )
            }
    }

    suspend fun ativarPromocao(id: Long): Boolean = dbQuery {
        val hojeKmp = LocalDate.now().toKotlinLocalDate()
        val rowsUpdated = PromocoesTable.update({ PromocoesTable.id eq id }) {
            it[status] = "ATIVA"
            it[dataAtivacao] = hojeKmp
        }
        rowsUpdated > 0
    }

    suspend fun recusarPromocao(id: Long): Boolean = dbQuery {
        val rowsUpdated = PromocoesTable.update({ PromocoesTable.id eq id }) {
            it[status] = "RECUSADA"
        }
        rowsUpdated > 0
    }

    private fun obterMelhorDiaDaSemana(produtoId: Long, dataInicio: kotlinx.datetime.LocalDate): DayOfWeek? {
        val vendasProduto = (ItensVendaTable innerJoin VendasTable)
            .selectAll()
            .where { (ItensVendaTable.produtoId eq produtoId) and (VendasTable.dataVenda greaterEq dataInicio) }
            .toList()

        if (vendasProduto.isEmpty()) return null

        val vendasPorDia = vendasProduto
            .groupBy {
                val dataJava = LocalDate.parse(it[VendasTable.dataVenda].toString())
                dataJava.dayOfWeek
            }
            .mapValues { (_, itens) ->
                itens.sumOf { it[ItensVendaTable.quantidade] }
            }

        return vendasPorDia.maxByOrNull { it.value }?.key
    }

    private fun DayOfWeek.nomeEmPortugues(): String = when (this) {
        DayOfWeek.MONDAY -> "Segunda-feira"
        DayOfWeek.TUESDAY -> "Terça-feira"
        DayOfWeek.WEDNESDAY -> "Quarta-feira"
        DayOfWeek.THURSDAY -> "Quinta-feira"
        DayOfWeek.FRIDAY -> "Sexta-feira"
        DayOfWeek.SATURDAY -> "Sábado"
        DayOfWeek.SUNDAY -> "Domingo"
    }
}
