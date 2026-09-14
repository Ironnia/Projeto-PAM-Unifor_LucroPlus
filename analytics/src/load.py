import os
from extract import extrair_dados
from transform import analisar_vendas_por_categoria

def carregar_dados(df_analise):
    print("Salvando resultados na pasta 'data'...")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(base_dir, '..', 'data', 'analise_categorias.csv')
    
    df_analise.to_csv(output_path, index=False)
    print(f"Sucesso! Análise salva em: {output_path}")

if __name__ == "__main__":
    print("=== Iniciando Pipeline de Dados (LucroPlus) ===")
    
    dados_brutos = extrair_dados()
    
    relatorio_categorias = analisar_vendas_por_categoria(dados_brutos)
    
    print("\nPrévia do Relatório:")
    print(relatorio_categorias.head())
    print("-" * 30)
    
    carregar_dados(relatorio_categorias)