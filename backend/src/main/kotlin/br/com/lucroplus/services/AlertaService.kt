package br.com.lucroplus.services

import br.com.lucroplus.database.AlertasTable
import br.com.lucroplus.database.DatabaseFactory.dbQuery
import br.com.lucroplus.database.IngredientesTable
import br.com.lucroplus.database.LotesTable
import br.com.lucroplus.models.AlertaDto
import br.com.lucroplus.models.IngredienteResumoDto
import br.com.lucroplus.models.LoteResumoDto
import kotlinx.datetime.toKotlinLocalDate
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.update
import java.time.LocalDate
import java.time.temporal.ChronoUnit

object AlertaService {

    suspend fun obterAlertasVencimento(): List<AlertaDto> = dbQuery {
        val hojeJava = LocalDate.now()
        val dataLimiteJava = hojeJava.plusDays(5)

        val hojeKmp = hojeJava.toKotlinLocalDate()
        val dataLimiteKmp = dataLimiteJava.toKotlinLocalDate()

        val lotesEmRisco = (LotesTable innerJoin IngredientesTable)
            .selectAll()
            .where { (LotesTable.dataValidade greaterEq hojeKmp) and (LotesTable.dataValidade lessEq dataLimiteKmp) }
            .toList()

        for (row in lotesEmRisco) {
            val loteId = row[LotesTable.id]
            val validadeKmp = row[LotesTable.dataValidade]
            val validadeJava = LocalDate.parse(validadeKmp.toString())
            val diasParaVencer = ChronoUnit.DAYS.between(hojeJava, validadeJava).toInt()

            val alertaExiste = AlertasTable
                .selectAll()
                .where { (AlertasTable.loteId eq loteId) and (AlertasTable.tipo eq "VENCIMENTO") }
                .count() > 0

            if (!alertaExiste) {
                val ingredienteNome = row[IngredientesTable.nome]
                val quantidade = row[LotesTable.quantidade]
                val unidade = row[IngredientesTable.unidade]
                val numeroLote = row[LotesTable.numeroLote] ?: "LOT-$loteId"

                val mensagem = when (diasParaVencer) {
                    0 -> "O lote $numeroLote de $ingredienteNome ($quantidade $unidade) vence HOJE! Urgente!"
                    1 -> "O lote $numeroLote de $ingredienteNome ($quantidade $unidade) vence amanhã! Crítico!"
                    else -> "O lote $numeroLote de $ingredienteNome ($quantidade $unidade) vence em $diasParaVencer dias! Atenção!"
                }

                AlertasTable.insert {
                    it[AlertasTable.loteId] = loteId
                    it[AlertasTable.tipo] = "VENCIMENTO"
                    it[AlertasTable.mensagem] = mensagem
                    it[AlertasTable.dataAlerta] = hojeKmp
                    it[AlertasTable.visualizado] = false
                }
            }
        }

        (AlertasTable innerJoin LotesTable innerJoin IngredientesTable)
            .selectAll()
            .where { (AlertasTable.visualizado eq false) and (AlertasTable.tipo eq "VENCIMENTO") }
            .orderBy(AlertasTable.id, org.jetbrains.exposed.sql.SortOrder.DESC)
            .map {
                val loteResumo = LoteResumoDto(
                    id = it[LotesTable.id],
                    quantidade = it[LotesTable.quantidade].toDouble(),
                    custoUnitario = it[LotesTable.custoUnitario].toDouble(),
                    ingrediente = IngredienteResumoDto(
                        nome = it[IngredientesTable.nome],
                        unidade = it[IngredientesTable.unidade]
                    )
                )

                AlertaDto(
                    id = it[AlertasTable.id],
                    loteId = it[AlertasTable.loteId],
                    tipo = it[AlertasTable.tipo],
                    mensagem = it[AlertasTable.mensagem],
                    dataAlerta = it[AlertasTable.dataAlerta].toString(),
                    visualizado = it[AlertasTable.visualizado],
                    lote = loteResumo
                )
            }
    }

    suspend fun marcarComoVisualizado(alertaId: Long): Boolean = dbQuery {
        val rowsUpdated = AlertasTable.update({ AlertasTable.id eq alertaId }) {
            it[visualizado] = true
        }
        rowsUpdated > 0
    }
}
