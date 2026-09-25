# Issue #21 — Teste de conexão com PDV

> Responsável real: João Victor (`Ironnia`)  
> Status em 25/09/2026: revisada e validada no staging e no laboratório; ainda sem commit, merge ou push no repositório oficial.

## Objetivo

Implementar `POST /configuracoes/pdv/testar-conexao` para testar uma configuração MySQL de PDV e responder rapidamente com sucesso ou erro. O modo simulado permite demonstrar o fluxo sem afirmar que existe um PDV externo real.

## Arquivos

- `ConfiguracaoModels.kt`: aceita URL JDBC ou host, porta, banco, usuário e senha; inclui tempo de resposta.
- `ConfiguracaoService.kt`: valida os parâmetros, executa a conexão em `Dispatchers.IO` e oferece o modo simulado.
- `ConfiguracaoRoutes.kt`: protege as rotas com JWT e usa HTTP 200 no sucesso ou 400 na falha.
- `ConfiguracaoRoutesTest.kt`: cobre autenticação, sucesso simulado, porta inválida, falha real e JSON malformado.

## Decisões de segurança

- Todas as rotas `/configuracoes` exigem JWT.
- A consulta de configuração não devolve a senha armazenada.
- Somente URLs `jdbc:mysql://` são aceitas.
- Exceções internas do driver não são enviadas ao cliente.
- A chave JWT dos testes é exclusiva do ambiente de teste e não usa `JWT_SECRET` real.

O banco atual ainda armazena a senha do PDV em `tb_configuracao`. Para produção, esse valor deverá usar um cofre de segredos ou criptografia adequada. Essa limitação não é escondida nem resolvida com uma chave gravada no código.

A `dev` oficial ainda possui uma chave JWT fixa em `JwtConfig.kt`, problema anterior à #21. O laboratório já exige `JWT_SECRET` externo. O alinhamento dessa configuração deve ser tratado em uma correção de segurança própria antes de qualquer ambiente público; não foi escondido dentro do commit do endpoint de PDV.

## Verificações executadas

Com Java 17:

- Maven: `BUILD SUCCESS`.
- Testes automatizados: 5 executados, 0 falhas, 0 erros.
- Newman no backend real do laboratório: 7 requisições, 20 asserções, 0 falhas.
- PDV simulado: HTTP 200 com `sucesso: true` e tempo em milissegundos.
- Conexão impossível, porta inválida e JSON malformado: HTTP 400.
- Requisição sem token: HTTP 401.
- Regressões de login, `/auth/me` e `/lotes`: não encontradas na suíte Postman.

## Critérios de aceitação

- [x] Recebe URL JDBC ou host, porta, banco, usuário e senha.
- [x] Retorna rapidamente o resultado e o tempo de resposta.
- [x] Retorna HTTP 200 no sucesso e HTTP 400 na falha.
- [x] Possui mock identificado para desenvolvimento e apresentação.
- [x] Exige autenticação e não devolve a senha salva.
- [x] Compila e possui testes automatizados verdes.

## Explicação curta para a professora

“O endpoint recebe os dados do banco do PDV, valida o formato e tenta abrir uma conexão JDBC fora da thread principal. Ele devolve 200 quando conecta e 400 quando a configuração ou a conexão falha. Para a demonstração, existe um modo simulado explicitamente identificado, que não finge ter acessado um PDV externo.”
