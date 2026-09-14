import pandas as pd

def analisar_vendas_por_categoria(dados):
    print("Iniciando processamento analítico (Transform)...")
    
    df_produtos = dados['produtos']
    df_itens = dados['itens']
    
    df_merged = pd.merge(
        df_itens, 
        df_produtos, 
        left_on='produto_id', 
        right_on='id', 
        suffixes=('_item', '_produto')
    )
    
    df_merged['receita_linha'] = df_merged['quantidade'] * df_merged['preco_unitario']
    
    df_receita_categoria = df_merged.groupby('categoria')['receita_linha'].sum().reset_index()
    
    df_receita_categoria.rename(columns={'receita_linha': 'faturamento_total'}, inplace=True)
    
    df_receita_categoria = df_receita_categoria.sort_values(by='faturamento_total', ascending=False)
    
    return df_receita_categoria