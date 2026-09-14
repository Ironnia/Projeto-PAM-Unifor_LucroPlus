import pandas as pd
import os

def extrair_dados():
    print("Carregando tabelas do mock CSV da pasta 'data'...")
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(base_dir, '..', 'data') 
    
    df_produto = pd.read_csv(os.path.join(data_dir, 'tb_produto.csv'))
    df_venda = pd.read_csv(os.path.join(data_dir, 'tb_venda.csv'))
    df_item_venda = pd.read_csv(os.path.join(data_dir, 'tb_item_venda.csv'))
    df_lote = pd.read_csv(os.path.join(data_dir, 'tb_lote.csv'))
    
    df_venda['data_venda'] = pd.to_datetime(df_venda['data_venda'])
    df_lote['data_validade'] = pd.to_datetime(df_lote['data_validade'])
    
    return {
        'produtos': df_produto,
        'vendas': df_venda,
        'itens': df_item_venda,
        'lotes': df_lote
    }