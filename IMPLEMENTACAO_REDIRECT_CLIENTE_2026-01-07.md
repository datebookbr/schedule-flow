# Implementação: Redirect do Cliente e Plano Promocional

**Data:** 2026-01-07  
**Versão:** 1.0

---

## Resumo das Alterações

Duas alterações foram implementadas no fluxo de cadastro de cliente:

1. **Redirect pós-pagamento**: Após o pagamento confirmado, o sistema agora utiliza o campo `redirect` da **tabela clientes** ao invés da tabela configurações.

2. **Plano promocional (valor = 0)**: Quando o valor do plano é zero (R$ 0,00), o cliente é redirecionado diretamente para o URL definido no campo `redirect` da tabela clientes, pulando a etapa de pagamento.

---

## Fluxo Atualizado

### Fluxo Normal (valor > 0)
```
Cadastro → Pagamento → Confirmação → Redirect (tabela clientes)
```

### Fluxo Promocional (valor = 0)
```
Cadastro → Redirect direto (tabela clientes)
```

---

## Alterações no Backend (API ASP)

### 1. Endpoint: POST /api/land_cadastro.asp

A resposta do cadastro de cliente deve incluir o campo `redirect` da tabela clientes.

**Request (sem alterações):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "whatsapp": "(11) 99999-9999",
  "cpfCnpj": "123.456.789-00",
  "tipoPessoa": "PF",
  "slug": "datebook"
}
```

**Response (campo redirect adicionado):**
```json
{
  "success": true,
  "customerId": "12345",
  "asaasCustomerId": "cus_abc123",
  "redirect": "https://app.datebook.com.br/onboarding?cliente=12345",
  "message": "Cliente cadastrado com sucesso"
}
```

### Campos da Tabela `clientes` Relevantes

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | INT | ID do cliente (customerId) |
| `redirect` | VARCHAR(500) | URL de redirecionamento após pagamento/cadastro |

---

## Alterações no Frontend

### Arquivos Modificados

1. **`src/lib/api.ts`**
   - Interface `CustomerResponse` atualizada para incluir campo `redirect`
   - Função `registerCustomer` retorna o campo `redirect` da resposta da API

2. **`src/pages/Cadastro.tsx`**
   - Verifica se o valor do plano é zero (`slugConfig?.valor === 0`)
   - Se promocional: redireciona diretamente para `result.redirect`
   - Se não promocional: navega para `/pagamento` passando `clientRedirect` como query param

3. **`src/pages/Pagamento.tsx`**
   - Lê o parâmetro `clientRedirect` da URL
   - Usa `clientRedirect` como prioridade para redirecionamento após confirmação
   - Fallback para `slugConfig?.redirect` se `clientRedirect` não estiver disponível

---

## Lógica de Redirecionamento

### Prioridade do Redirect (Pagamento.tsx)

```
1. clientRedirect (tabela clientes - via query param)
2. slugConfig.redirect (tabela configurações - fallback)
3. "/" (fallback final)
```

### Código de Verificação Promocional (Cadastro.tsx)

```typescript
const planValue = slugConfig?.valor ?? 0;
const isPromotional = planValue === 0;

if (isPromotional && result.redirect) {
  // Redireciona diretamente (pula pagamento)
  window.location.href = result.redirect;
} else {
  // Navega para página de pagamento
  navigate(`/pagamento?...&clientRedirect=${result.redirect}`);
}
```

---

## Query Parameters da Página de Pagamento

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `slug` | Identificador da configuração | `datebook` |
| `customerId` | ID do cliente na tabela clientes | `12345` |
| `asaasCustomerId` | ID do cliente no Asaas | `cus_abc123` |
| `valor` | Valor do plano | `49.90` |
| `clientRedirect` | URL de redirect do cliente (NOVO) | `https://app.datebook.com.br/...` |

---

## Testes Recomendados

### Teste 1: Plano Normal (valor > 0)
1. Acessar `/cadastro?slug=datebook`
2. Preencher formulário e submeter
3. Verificar se navega para `/pagamento` com parâmetro `clientRedirect`
4. Completar pagamento (PIX ou Cartão)
5. Verificar se redireciona para URL da tabela clientes

### Teste 2: Plano Promocional (valor = 0)
1. Configurar um plano com valor 0 na tabela configurações
2. Acessar `/cadastro?slug=plano-gratis`
3. Preencher formulário e submeter
4. Verificar se redireciona DIRETAMENTE (sem passar por pagamento)
5. Verificar URL de destino (tabela clientes)

### Teste 3: Fallback
1. Testar com cliente sem campo `redirect` preenchido
2. Verificar se usa fallback da tabela configurações
3. Verificar se usa "/" como último fallback

---

## Logs de Debug

Os seguintes logs foram adicionados para facilitar depuração:

```
[CADASTRO] Plano promocional detectado (valor = 0). Redirecionando para: <URL>
[REDIRECT] Redirecting to: <URL>
```

---

## Considerações de Segurança

1. **Validação de URL**: O backend deve validar que o campo `redirect` contém uma URL válida e segura
2. **Domínios permitidos**: Considerar implementar whitelist de domínios permitidos para redirect
3. **Sanitização**: Evitar injeção de scripts via campo redirect

---

## Rollback

Para reverter as alterações, restaurar os arquivos para versões anteriores:
- `src/lib/api.ts`
- `src/pages/Cadastro.tsx`
- `src/pages/Pagamento.tsx`

O fluxo voltará a usar apenas o campo `redirect` da tabela configurações.
