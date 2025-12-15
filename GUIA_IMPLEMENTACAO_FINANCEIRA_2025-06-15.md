# Guia de Implementação Financeira - Datebook
**Data: 15 de Junho de 2025**

---

## 📋 Visão Geral

Este documento descreve a integração de pagamentos entre o frontend React (Lovable) e o backend ASP Classic na Locaweb, utilizando a API do Asaas como gateway de pagamento.

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│   Frontend React    │────▶│   Backend ASP       │────▶│   Asaas API         │
│   (Lovable)         │     │   (Locaweb)         │     │   (Gateway)         │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
         │                           │                           │
         │  FormData POST            │  JSON POST                │
         │  /api/land_cadastro.asp   │  api.asaas.com            │
         │  /api/asaas.asp           │                           │
         └───────────────────────────┴───────────────────────────┘
```

---

## 📡 APIs Implementadas

### 1. Cadastro de Cliente - `/api/land_cadastro.asp`

**Método:** POST  
**Content-Type:** multipart/form-data

#### Campos Enviados:
| Campo     | Tipo   | Obrigatório | Descrição                    |
|-----------|--------|-------------|------------------------------|
| name      | string | ✅          | Nome completo do cliente     |
| email     | string | ✅          | Email do cliente             |
| cpfCnpj   | string | ✅          | CPF ou CNPJ (apenas números) |
| phone     | string | ❌          | Telefone com DDD             |
| company   | string | ❌          | Nome da empresa              |
| address   | string | ❌          | Endereço completo            |
| city      | string | ❌          | Cidade                       |
| state     | string | ❌          | Estado (UF)                  |
| zipCode   | string | ❌          | CEP                          |
| planId    | string | ❌          | ID do plano selecionado      |

#### Resposta Esperada:
```json
{
  "success": true,
  "customerId": "cus_123abc456def",
  "asaas_ready": true
}
```

#### Resposta de Erro:
```json
{
  "success": false,
  "error": "Descrição do erro"
}
```

---

### 2. Processamento de Pagamento - `/api/asaas.asp`

**Método:** POST  
**Content-Type:** multipart/form-data

#### Campos para PIX:
| Campo       | Tipo   | Obrigatório | Descrição                          |
|-------------|--------|-------------|-------------------------------------|
| customerId  | string | ✅          | ID do cliente retornado do cadastro |
| billingType | string | ✅          | "PIX"                               |
| value       | string | ✅          | Valor em reais (ex: "49.90")        |
| dueDate     | string | ❌          | Data de vencimento (YYYY-MM-DD)     |
| description | string | ❌          | Descrição do pagamento              |

#### Resposta PIX Esperada:
```json
{
  "success": true,
  "paymentId": "pay_123abc456def",
  "status": "PENDING",
  "pixData": {
    "imageDataUrl": "data:image/png;base64,iVBORw0KGgo...",
    "payload": "00020126580014br.gov.bcb.pix..."
  }
}
```

#### Campos para Cartão de Crédito:
| Campo              | Tipo   | Obrigatório | Descrição                          |
|--------------------|--------|-------------|-------------------------------------|
| customerId         | string | ✅          | ID do cliente                       |
| billingType        | string | ✅          | "CREDIT_CARD"                       |
| value              | string | ✅          | Valor em reais                      |
| cardHolderName     | string | ✅          | Nome impresso no cartão             |
| cardNumber         | string | ✅          | Número do cartão (apenas números)   |
| cardExpiryMonth    | string | ✅          | Mês de expiração (01-12)            |
| cardExpiryYear     | string | ✅          | Ano de expiração (YYYY)             |
| cardCcv            | string | ✅          | CVV do cartão                       |
| holderName         | string | ✅          | Nome do titular                     |
| holderEmail        | string | ✅          | Email do titular                    |
| holderCpfCnpj      | string | ✅          | CPF/CNPJ do titular                 |
| holderPostalCode   | string | ✅          | CEP do titular                      |
| holderAddressNumber| string | ✅          | Número do endereço                  |
| holderPhone        | string | ✅          | Telefone do titular                 |

#### Resposta Cartão Esperada:
```json
{
  "success": true,
  "paymentId": "pay_123abc456def",
  "status": "CONFIRMED",
  "invoiceUrl": "https://www.asaas.com/i/..."
}
```

---

### 3. Consulta de Status - `/api/asaas.asp`

**Método:** GET  
**Query Params:** `?action=status&paymentId=pay_123abc456def`

#### Resposta Esperada:
```json
{
  "success": true,
  "status": "CONFIRMED",
  "confirmedDate": "2025-06-15T14:30:00Z"
}
```

#### Status Possíveis:
| Status        | Descrição                              |
|---------------|----------------------------------------|
| PENDING       | Aguardando pagamento                   |
| RECEIVED      | Pagamento recebido                     |
| CONFIRMED     | Pagamento confirmado                   |
| OVERDUE       | Vencido                                |
| REFUNDED      | Estornado                              |
| RECEIVED_IN_CASH | Recebido em dinheiro                |
| REFUND_REQUESTED | Estorno solicitado                  |
| CHARGEBACK_REQUESTED | Chargeback solicitado           |
| CHARGEBACK_DISPUTE | Em disputa de chargeback          |
| AWAITING_CHARGEBACK_REVERSAL | Aguardando reversão     |
| DUNNING_REQUESTED | Em processo de cobrança            |
| DUNNING_RECEIVED | Cobrança recebida                   |

---

## 🔄 Fluxo de Pagamento PIX

```
1. Usuário preenche cadastro
   ↓
2. Frontend envia POST para /api/land_cadastro.asp
   ↓
3. Backend cria cliente no Asaas
   ↓
4. Backend retorna customerId
   ↓
5. Frontend redireciona para página de pagamento
   ↓
6. Frontend envia POST para /api/asaas.asp (PIX)
   ↓
7. Backend cria cobrança PIX no Asaas
   ↓
8. Backend retorna QR Code e payload
   ↓
9. Frontend exibe QR Code para usuário
   ↓
10. Frontend inicia polling a cada 5 segundos
    ↓
11. Usuário paga via app do banco
    ↓
12. Polling detecta status CONFIRMED
    ↓
13. Frontend exibe tela de sucesso
```

---

## 📁 Arquivos Envolvidos

### Frontend (React)
- `src/lib/api.ts` - Funções de chamada às APIs
- `src/pages/Cadastro.tsx` - Formulário de cadastro
- `src/pages/Pagamento.tsx` - Página de pagamento

### Backend (ASP Classic)
- `/api/land_cadastro.asp` - Cadastro de cliente
- `/api/asaas.asp` - Processamento de pagamentos

---

## ⚙️ Configuração do Backend ASP

### Variáveis de Ambiente Necessárias:
```asp
' Configuração Asaas
Const ASAAS_API_KEY = "$aact_YTU5YTE0M2M2..."
Const ASAAS_API_URL = "https://api.asaas.com/v3"  ' Produção
' Const ASAAS_API_URL = "https://sandbox.asaas.com/api/v3"  ' Sandbox
```

### Exemplo de Implementação ASP:

#### land_cadastro.asp:
```asp
<%@ Language="VBScript" CodePage="65001" %>
<%
Response.ContentType = "application/json"
Response.Charset = "utf-8"

' Receber dados do FormData
Dim name, email, cpfCnpj, phone
name = Request.Form("name")
email = Request.Form("email")
cpfCnpj = Request.Form("cpfCnpj")
phone = Request.Form("phone")

' TODO: Validar dados
' TODO: Salvar no banco de dados local
' TODO: Criar cliente no Asaas

' Retornar resposta
Response.Write "{""success"": true, ""customerId"": ""cus_123"", ""asaas_ready"": true}"
%>
```

#### asaas.asp (PIX):
```asp
<%@ Language="VBScript" CodePage="65001" %>
<%
Response.ContentType = "application/json"
Response.Charset = "utf-8"

Dim action
action = Request.QueryString("action")

If action = "status" Then
    ' Consultar status do pagamento
    Dim paymentId
    paymentId = Request.QueryString("paymentId")
    ' TODO: Fazer GET para Asaas API
    Response.Write "{""success"": true, ""status"": ""PENDING""}"
Else
    ' Criar cobrança
    Dim customerId, billingType, value
    customerId = Request.Form("customerId")
    billingType = Request.Form("billingType")
    value = Request.Form("value")
    
    ' TODO: Fazer POST para Asaas API
    ' TODO: Retornar QR Code do PIX
    Response.Write "{""success"": true, ""paymentId"": ""pay_123"", ""status"": ""PENDING"", ""pixData"": {""imageDataUrl"": ""data:image/png;base64,...""  , ""payload"": ""00020126580014br.gov.bcb.pix...""}}"
End If
%>
```

---

## 🔒 Segurança

### Boas Práticas:
1. **NUNCA** expor a API Key do Asaas no frontend
2. Validar todos os dados no backend antes de processar
3. Usar HTTPS em todas as comunicações
4. Implementar rate limiting nas APIs
5. Registrar logs de todas as transações
6. Validar CPF/CNPJ antes de criar cliente

### Tratamento de Erros:
- Sempre retornar JSON válido, mesmo em erros
- Incluir mensagens de erro descritivas para debug
- Não expor detalhes técnicos para o usuário final

---

## 🧪 Ambiente de Testes

### Sandbox Asaas:
- URL: `https://sandbox.asaas.com/api/v3`
- Criar conta em: https://sandbox.asaas.com

### Dados de Teste:
- CPF válido: `19880507003`
- CNPJ válido: `06106743000108`
- Cartão de teste: `5162306219378829` (aprovado)
- CVV: qualquer 3 dígitos
- Validade: qualquer data futura

---

## 📞 Suporte

- **Documentação Asaas:** https://docs.asaas.com
- **API Reference:** https://docs.asaas.com/reference
- **Suporte Asaas:** suporte@asaas.com.br

---

## ✅ Checklist de Implementação

### Backend ASP:
- [ ] Criar `/api/land_cadastro.asp`
- [ ] Implementar criação de cliente no Asaas
- [ ] Criar `/api/asaas.asp` para PIX
- [ ] Criar `/api/asaas.asp` para cartão de crédito
- [ ] Implementar consulta de status
- [ ] Adicionar validações de entrada
- [ ] Configurar logs de transações
- [ ] Testar em ambiente sandbox
- [ ] Migrar para produção

### Frontend React:
- [x] Atualizar `src/lib/api.ts` para usar APIs ASP
- [x] Implementar formulário de cadastro
- [x] Implementar página de pagamento PIX
- [x] Implementar polling de status
- [x] Adicionar máscaras de input
- [ ] Testar fluxo completo
- [ ] Tratar todos os erros possíveis

---

*Documento gerado em 15/06/2025 - Versão 1.0*
