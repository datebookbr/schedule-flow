# Guia de Implementação - Integração com APIs ASP Classic

**Data:** 2026-01-02  
**Versão:** 2.0

---

## Resumo das Alterações

Este documento descreve as alterações realizadas no frontend para integrar corretamente com as APIs ASP Classic da Locaweb para processamento de pagamentos via Asaas.

---

## Fluxo Completo de Pagamento

### 1. Carregamento da Configuração (GET)

**Endpoint:** `/api/land_cadastro.asp?slug=xxx`

**Resposta:**
```json
{
  "success": true,
  "valor": 49.90,
  "destinatario": "Nome do Destinatário",
  "redirect": "https://site.com/sucesso",
  "descricaoProduto": "Descrição do Produto"
}
```

### 2. Cadastro do Cliente (POST)

**Endpoint:** `/api/land_cadastro.asp`

**Payload (JSON):**
```json
{
  "nome": "Nome Completo",
  "cpfCnpj": "123.456.789-00",
  "tipoPessoa": "PF",
  "email": "email@exemplo.com",
  "whatsapp": "(11) 99999-9999",
  "companhia": "Nome da Empresa",
  "rua": "Rua Exemplo",
  "numero": "123",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "uf": "SP",
  "cep": "01234-567",
  "descricao": "Observações",
  "slug": "identificador-do-produto"
}
```

**Resposta:**
```json
{
  "success": true,
  "customerId": "123",
  "asaasCustomerId": "cus_xxxxxxxxx",
  "message": "Cliente cadastrado com sucesso"
}
```

### 3. Criação do Pagamento (POST)

**Endpoint:** `/api/land_pagamento_criar.asp`

**Payload PIX:**
```json
{
  "asaasCustomerId": "cus_xxxxxxxxx",
  "customerId": "123",
  "valor": 49.90,
  "metodo": "PIX",
  "slug": "identificador-do-produto"
}
```

**Payload Cartão:**
```json
{
  "asaasCustomerId": "cus_xxxxxxxxx",
  "customerId": "123",
  "valor": 49.90,
  "metodo": "CARTAO",
  "slug": "identificador-do-produto",
  "cardNumero": "1234567890123456",
  "cardNome": "NOME NO CARTAO",
  "cardValidade": "12/25",
  "cardCvv": "123"
}
```

**Resposta PIX:**
```json
{
  "success": true,
  "asaasPaymentId": "pay_xxxxxxxxx",
  "status": "pending",
  "pixCode": "00020126580014br.gov.bcb.pix...",
  "pixQrCode": "iVBORw0KGgo... (base64)",
  "message": "Pagamento criado com sucesso"
}
```

### 4. Verificação de Status (GET - Polling)

**Endpoint:** `/api/land_pagamento_status.asp?transactionId=pay_xxxxxxxxx`

**Resposta:**
```json
{
  "status": "pending | confirmed | failed",
  "asaasPaymentId": "pay_xxxxxxxxx"
}
```

---

## Arquivos Modificados

### 1. `src/lib/api.ts`

**Alterações principais:**
- Removidas funções legadas (`createAsaasCustomer`, `createAsaasPayment`, `getAsaasPaymentStatus`)
- Adicionada `fetchSlugConfig(slug)` - GET para buscar configuração do produto
- Adicionada `registerCustomer(data)` - POST para cadastrar cliente
- Adicionada `createPayment(data)` - POST para criar pagamento (PIX ou Cartão)
- Adicionada `checkPaymentStatus(transactionId)` - GET para polling de status

**Interface CustomerData atualizada:**
```typescript
interface CustomerData {
  nome: string;
  email: string;
  whatsapp: string;
  cpfCnpj: string;
  tipoPessoa: 'PF' | 'PJ';
  companhia?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
  descricao?: string;
  slug: string;
}
```

### 2. `src/pages/Cadastro.tsx`

**Alterações principais:**
- Removida dependência de `fetchPlanById` - agora usa `fetchSlugConfig`
- Formulário expandido com campos separados de endereço:
  - `rua` (logradouro)
  - `numero`
  - `bairro`
  - `cidade`
  - `uf` (estado)
  - `cep`
- Campo `descricao` para observações
- Navegação para `/pagamento` passa `customerId`, `asaasCustomerId`, `valor` e `slug`

### 3. `src/pages/Pagamento.tsx`

**Alterações principais:**
- Integração com `createPayment` e `checkPaymentStatus`
- Polling automático a cada 3 segundos após gerar PIX
- Timeout de segurança de 10 minutos
- Tela de sucesso com countdown de 5 segundos antes do redirect
- Redirect para URL configurada no banco (`slugConfig.redirect`)
- Campos de cartão renomeados para português:
  - `cardNumero`
  - `cardNome`
  - `cardValidade`
  - `cardCvv`

---

## Polling de Status

### Configuração
```typescript
const POLLING_INTERVAL = 3000;  // 3 segundos
const POLLING_TIMEOUT = 600000; // 10 minutos
```

### Fluxo
1. Após gerar PIX, inicia polling automático
2. A cada 3 segundos, faz GET em `/api/land_pagamento_status.asp`
3. Quando `status === 'confirmed'`:
   - Mostra toast de sucesso
   - Exibe tela de confirmação
   - Inicia countdown de 5 segundos
   - Redireciona para URL do campo `redirect` da tabela `configuracoes`
4. Após 10 minutos sem confirmação, para o polling

---

## Campos da Tabela `clientes` (Banco de Dados)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| nome | VARCHAR | Nome completo |
| cpf_cnpj | VARCHAR | CPF ou CNPJ |
| tipo_pessoa | VARCHAR | 'PF' ou 'PJ' |
| email | VARCHAR | E-mail |
| whatsapp | VARCHAR | Telefone WhatsApp |
| companhia | VARCHAR | Nome da empresa |
| rua | VARCHAR | Logradouro |
| numero | VARCHAR | Número |
| bairro | VARCHAR | Bairro |
| cidade | VARCHAR | Cidade |
| uf | VARCHAR | Estado (UF) |
| cep | VARCHAR | CEP |
| descricao | TEXT | Observações |
| slug | VARCHAR | Identificador do produto |
| asaas_customer_id | VARCHAR | ID do cliente no Asaas |

---

## Campos da Tabela `configuracoes` (Banco de Dados)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| slug | VARCHAR | Identificador único do produto |
| valor | DECIMAL | Valor do pagamento |
| destinatario | VARCHAR | Nome do destinatário |
| redirect | VARCHAR | URL de redirecionamento após pagamento |
| descricao_produto | VARCHAR | Descrição do produto |
| asaas_api_key | VARCHAR | Chave API do Asaas |
| asaas_environment | VARCHAR | 'sandbox' ou 'production' |
| ativo | TINYINT | 1 = ativo, 0 = inativo |

---

## Debug

O código inclui logs detalhados para debug:

```typescript
console.log('[CADASTRO] Enviando dados:', customerData);
console.log('[PIX] Generating PIX for customer:', {...});
console.log('[POLLING] Checking payment status for:', asaasPaymentId);
console.log('[REDIRECT] Redirecting to:', redirectUrl);
```

Verifique o console do navegador (F12 > Console) para acompanhar o fluxo.

---

## Testes

### PIX
1. Acesse `/cadastro?slug=seu-slug`
2. Preencha o formulário
3. Clique "Continuar para Pagamento"
4. Selecione PIX e clique "Gerar código PIX"
5. O QR Code será exibido
6. O sistema fará polling a cada 3 segundos
7. Após confirmação (via webhook), será redirecionado

### Cartão
1. Acesse `/cadastro?slug=seu-slug`
2. Preencha o formulário
3. Clique "Continuar para Pagamento"
4. Selecione Cartão de Crédito
5. Preencha os dados do cartão
6. Clique "Pagar"
7. Aguarde confirmação

---

## Webhook Asaas

O backend já está configurado para receber webhooks do Asaas em:

**Endpoint:** `/api/land_pagamento_status.asp` (POST)

O webhook atualiza o campo `status` na tabela `pagamentos` para `confirmed` quando o pagamento é confirmado.
