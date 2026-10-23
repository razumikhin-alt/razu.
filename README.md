# razu.

O razu. organiza seus Reels salvos em uma biblioteca particular, com busca por palavras e categorias.
Seu próprio ChatGPT instala o aplicativo na sua infraestrutura e mantém a biblioteca atualizada na nuvem.
Cada pessoa usa seu próprio Site, seus dados e suas conexões. O produto não exige Notion.

## Instalação

Abra uma conversa Work pelo aplicativo do ChatGPT no seu celular e envie este comando:

```text
Instale meu sync a partir de https://github.com/razumikhin-alt/razu.
Use a versão da branch main e siga INSTALAR.txt e INSTRUCOES-DO-AGENTE.md.
Faça o provisionamento na minha conta e mantenha meu Site e meus dados privados.
Conduza comigo a configuração e o teste manual, do início ao fim.
Deixe-me escolher o intervalo e o fuso da captura automática.
```

O ponto final de `razu.` faz parte do nome do repositório; o endereço sem esse ponto pertence a outro projeto.

Use a execução na nuvem. Mantenha "run on this computer" desligado quando essa opção aparecer.
Se você recebeu um arquivo ZIP, anexe-o e envie o texto de INSTALAR.txt.
O ChatGPT usa INSTRUCOES-DO-AGENTE.md para instalar e verificar o aplicativo.
Você fornece as autorizações, o acesso ao Instagram e suas preferências durante a configuração.

Antes de configurar a tarefa, autentique o Instagram em uma conversa Work pelo aplicativo do ChatGPT no seu celular.
Use AUTENTICAR-INSTAGRAM.txt nessa conversa e mantenha "run on this computer" desligado.
Conclua o login pelo formulário seguro que o ChatGPT apresentar.
O ChatGPT confirma o acesso aos seus Salvos antes de continuar a instalação.
Se o acesso expirar, repita essa preparação com a orientação do ChatGPT.

## Resultados da tarefa

Clique ou toque em qualquer ponto da capa para abrir o vídeo.
Use as setas do player para percorrer as referências da busca atual.
Em dispositivos touch, deslize para cima ou para baixo na faixa lateral "Deslize aqui".
Os controles dentro do vídeo pertencem ao Instagram e recebem seus próprios gestos.
O player carrega a próxima página quando necessário e preserva os filtros e a ordem.

Escolha todos os Salvos ou coleções específicas durante a configuração.
O ChatGPT associa as coleções do Instagram à biblioteca e guarda o progresso de cada lista.
Após uma interrupção, o ChatGPT retoma a descoberta e evita referências duplicadas.
Cada execução processa primeiro os itens pendentes elegíveis. Depois, busca novos favoritos.
Conteúdos sem fala confirmada podem ficar completos, com os campos de transcrição vazios.
Uma falha de transcrição mantém o conteúdo parcial até uma nova verificação.
Uma mudança de escopo preserva as referências já guardadas.
Escolha importar o acervo existente ou somente novos favoritos.
No modo somente novos, o ChatGPT conclui primeiro o levantamento do escopo escolhido, sem importar os Reels encontrados.
Os Reels encontrados durante esse levantamento também ficam excluídos. Depois dele, o ChatGPT importa os que ainda não conhece.
A escolha inicial fica bloqueada quando a descoberta começa. Uma ampliação do escopo pode exigir outro levantamento.
Confirme esse comportamento durante a validação da sua instalação.

Abra Scheduled e selecione a execução que deseja conferir.
Uma tarefa independente apresenta o resultado em uma conversa separada.
Entregue esse resultado ao ChatGPT quando precisar conferir a importação.
O teste manual valida o método de captura. Não é necessário aguardar uma ocorrência automática para concluir essa validação.

## Estado da versão

Este pacote é uma versão para validação. Teste a instalação e a captura manual na nuvem, na sua própria conta.
Escolha livremente o intervalo ou os horários da atualização automática. O agente confirma a tarefa salva conforme sua escolha.
Se uma capacidade necessária estiver indisponível, o agente informa o impedimento e preserva os resultados já obtidos.

## Skills incluídas

- instalar: instala ou atualiza seu sync privado.
- autenticar: guia o acesso ao Instagram no navegador da nuvem.
- capturar-favoritos: descobre e importa os Reels salvos, um por vez.
- agendar: configura a tarefa na nuvem no intervalo escolhido.
- processar-pendente: percorre a fila e remove os arquivos de cada item.

A instalação adiciona essas skills ao plugin do seu próprio Site.
A fila preserva cada tentativa após interrupções e prioriza itens ainda não tentados.
Uma falha da transcrição mantém o item parcial e permite continuar as etapas disponíveis.
Cancelamentos e limites da plataforma continuam possíveis. A tarefa agendada retoma o trabalho na próxima ocorrência.

## Atualizar

O razu. avisa na biblioteca quando uma nova versão fica disponível no GitHub.
Selecione **Ver atualização** e copie o pedido. Envie-o no Work pelo aplicativo do ChatGPT no seu celular.
O ChatGPT atualiza o Site e as skills, preservando seus dados e suas configurações.
O aviso aparece após a verificação periódica; não é uma notificação do celular.
Para atualizar, envie: "Atualize meu sync pelo pacote oficial https://github.com/razumikhin-alt/razu. Preserve meu Site e meus dados."

---

## Estrutura Técnica e Funções do Projeto

- **`app/runtime/acquire.mjs`**: Normalização de URLs, cálculo determinístico de `media_id`, extração de metadados OpenGraph/Twitter e controle de rate limiting (`inspectResponse`).
- **`app/runtime/transcribe.py`**: Pipeline de áudio via `ffmpeg` (PCM linear 16kHz mono) e transcrição via `faster-whisper` com telemetria desativada.
- **`app/app/mcp/route.ts`**: Servidor MCP baseado em JSON-RPC 2.0 (`POST /mcp`) para expor ferramentas nativas aos agentes.
- **`app/server/store.ts`**: Camada de persistência relacional (Cloudflare D1 SQLite) com controle de leases de concorrência e paginação de filas.

## Esta revisão

O pacote contém o aplicativo razu. exportado da versão 9 do Site e o instalador compatível. O aplicativo declara a versão 1.7.7; o runtime de captura é 1.7.5. O repositório não contém dados, credenciais nem o identificador de um Site existente.

Na biblioteca, cada vídeo pode receber título curto; o card permite editar a categoria. O menu oferece classificar, renomear, reprocessar e remover. O player abre o vídeo no card. O reprocessamento reaproveita análises já existentes e solicita apenas modalidades ausentes, conforme o workflow.

A instalação independente e a captura agendada precisam ser validadas na conta de destino. Um repositório privado exige que o Work tenha acesso ao GitHub da pessoa. O aviso de novas versões pelo Site requer um feed acessível configurado separadamente; sem ele, a biblioteca continua funcionando e a verificação de atualizações fica indisponível.
