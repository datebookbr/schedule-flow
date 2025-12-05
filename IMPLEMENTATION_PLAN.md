# Plano de Implementação - Datebook Landing Page

## Visão Geral

Este documento detalha a implementação completa do sistema de landing page dinâmica do Datebook, incluindo estrutura de banco de dados, APIs necessárias e formatos JSON.

---

## 1. Estrutura do Banco de Dados (MySQL)

### 1.1 Tabela: `land_config`
Configurações gerais do site.

```sql
CREATE TABLE land_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dados iniciais
INSERT INTO land_config (chave, valor) VALUES
('site_name', 'Datebook'),
('site_description', 'Sistema de agendamento online para profissionais'),
('logo_url', ''),
('primary_color', '#0d9488'),
('accent_color', '#f97316'),
('contact_email', 'contato@datebook.com.br'),
('contact_phone', '(11) 99999-9999'),
('whatsapp', '5511999999999'),
('instagram', 'https://instagram.com/datebook'),
('facebook', 'https://facebook.com/datebook'),
('address', 'São Paulo, SP'),
('hero_title', 'Simplifique seus Agendamentos'),
('hero_subtitle', 'Plataforma completa para gerenciar sua agenda profissional com integração WhatsApp automática'),
('cta_title', 'Pronto para Transformar seu Negócio?'),
('cta_subtitle', 'Comece agora mesmo e veja a diferença em sua gestão de agendamentos');
```

### 1.2 Tabela: `land_beneficios`
Benefícios exibidos na landing page.

```sql
CREATE TABLE land_beneficios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    icone VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    ordem INT DEFAULT 0,
    ativo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais
INSERT INTO land_beneficios (icone, titulo, descricao, ordem) VALUES
('Calendar', 'Agendamento Online 24/7', 'Seus clientes podem agendar a qualquer momento, de qualquer lugar', 1),
('MessageCircle', 'WhatsApp Automático', 'Envio automático de confirmações e lembretes via WhatsApp', 2),
('Users', 'Múltiplos Profissionais', 'Gerencie a agenda de toda sua equipe em um só lugar', 3),
('Globe', 'Página Exclusiva', 'Página personalizada com seus serviços, endereço e mapa', 4),
('Clock', 'Bloqueio de Horários', 'Bloqueie feriados e horários especiais facilmente', 5),
('Shield', 'Segurança Total', 'Seus dados e de seus clientes protegidos com criptografia', 6);
```

### 1.3 Tabela: `land_servicos`
Serviços/funcionalidades do sistema.

```sql
CREATE TABLE land_servicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    icone VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    recursos JSON,
    ordem INT DEFAULT 0,
    ativo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais
INSERT INTO land_servicos (icone, titulo, descricao, recursos, ordem) VALUES
('Calendar', 'Gestão de Agenda', 'Controle total sobre seus horários e disponibilidade', 
 '["Visualização por dia, semana e mês", "Bloqueio de horários e feriados", "Múltiplas agendas simultâneas", "Sincronização em tempo real"]', 1),
('MessageCircle', 'Comunicação Automática', 'Mantenha seus clientes sempre informados', 
 '["Confirmação automática via WhatsApp", "Lembretes de consulta", "Mensagens personalizáveis", "Histórico de comunicações"]', 2),
('Globe', 'Presença Online', 'Sua página profissional na internet', 
 '["Página exclusiva personalizada", "Lista de serviços e preços", "Informações de contato", "Integração com Google Maps"]', 3);
```

### 1.4 Tabela: `land_planos`
Planos de assinatura.

```sql
CREATE TABLE land_planos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    preco_adicional DECIMAL(10,2) DEFAULT 0,
    periodo VARCHAR(20) DEFAULT 'mês',
    max_profissionais INT DEFAULT 1,
    popular TINYINT(1) DEFAULT 0,
    ordem INT DEFAULT 0,
    ativo TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais
INSERT INTO land_planos (nome, descricao, preco, preco_adicional, max_profissionais, popular, ordem) VALUES
('Starter', 'Ideal para profissionais autônomos', 49.90, 29.90, 1, 0, 1),
('Professional', 'Para pequenas equipes', 89.90, 24.90, 3, 1, 2),
('Enterprise', 'Para clínicas e salões', 149.90, 19.90, 10, 0, 3);
```

### 1.5 Tabela: `land_planos_recursos`
Recursos incluídos em cada plano.

```sql
CREATE TABLE land_planos_recursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plano_id INT NOT NULL,
    recurso VARCHAR(200) NOT NULL,
    incluso TINYINT(1) DEFAULT 1,
    ordem INT DEFAULT 0,
    FOREIGN KEY (plano_id) REFERENCES land_planos(id) ON DELETE CASCADE
);

-- Recursos do plano Starter (id=1)
INSERT INTO land_planos_recursos (plano_id, recurso, incluso, ordem) VALUES
(1, 'Até 1 profissional', 1, 1),
(1, 'Agendamento online ilimitado', 1, 2),
(1, 'WhatsApp automático', 1, 3),
(1, 'Página exclusiva', 1, 4),
(1, 'Suporte por email', 1, 5),
(1, 'Múltiplas agendas', 0, 6),
(1, 'Relatórios avançados', 0, 7);

-- Recursos do plano Professional (id=2)
INSERT INTO land_planos_recursos (plano_id, recurso, incluso, ordem) VALUES
(2, 'Até 3 profissionais', 1, 1),
(2, 'Agendamento online ilimitado', 1, 2),
(2, 'WhatsApp automático', 1, 3),
(2, 'Página exclusiva', 1, 4),
(2, 'Suporte prioritário', 1, 5),
(2, 'Múltiplas agendas', 1, 6),
(2, 'Relatórios básicos', 1, 7);

-- Recursos do plano Enterprise (id=3)
INSERT INTO land_planos_recursos (plano_id, recurso, incluso, ordem) VALUES
(3, 'Até 10 profissionais', 1, 1),
(3, 'Agendamento online ilimitado', 1, 2),
(3, 'WhatsApp automático', 1, 3),
(3, 'Página exclusiva', 1, 4),
(3, 'Suporte 24/7', 1, 5),
(3, 'Múltiplas agendas', 1, 6),
(3, 'Relatórios avançados', 1, 7),
(3, 'API de integração', 1, 8);
```

### 1.6 Tabela: `land_clientes`
Cadastro de clientes interessados.

```sql
CREATE TABLE land_clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    empresa VARCHAR(200),
    segmento VARCHAR(100),
    cpf_cnpj VARCHAR(20),
    plano_id INT,
    status ENUM('pendente', 'aguardando_pagamento', 'ativo', 'cancelado') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (plano_id) REFERENCES land_planos(id)
);

CREATE INDEX idx_clientes_email ON land_clientes(email);
CREATE INDEX idx_clientes_status ON land_clientes(status);
```

### 1.7 Tabela: `land_pagamentos`
Registro de pagamentos.

```sql
CREATE TABLE land_pagamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id INT NOT NULL,
    plano_id INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    metodo ENUM('pix', 'cartao') NOT NULL,
    status ENUM('pendente', 'processando', 'aprovado', 'recusado', 'cancelado') DEFAULT 'pendente',
    gateway_id VARCHAR(100),
    gateway_response JSON,
    pix_code TEXT,
    pix_qrcode TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES land_clientes(id),
    FOREIGN KEY (plano_id) REFERENCES land_planos(id)
);

CREATE INDEX idx_pagamentos_status ON land_pagamentos(status);
CREATE INDEX idx_pagamentos_cliente ON land_pagamentos(cliente_id);
```

---

## 2. APIs Necessárias

### 2.1 GET `/api/land_config.asp`
Retorna configurações do site.

**Response JSON:**
```json
{
  "success": true,
  "data": {
    "name": "Datebook",
    "description": "Sistema de agendamento online para profissionais",
    "logo": "https://seusite.com.br/images/logo.png",
    "primaryColor": "#0d9488",
    "accentColor": "#f97316",
    "contact": {
      "email": "contato@datebook.com.br",
      "phone": "(11) 99999-9999",
      "whatsapp": "5511999999999",
      "address": "São Paulo, SP"
    },
    "social": {
      "instagram": "https://instagram.com/datebook",
      "facebook": "https://facebook.com/datebook"
    },
    "hero": {
      "title": "Simplifique seus Agendamentos",
      "subtitle": "Plataforma completa para gerenciar sua agenda profissional"
    },
    "cta": {
      "title": "Pronto para Transformar seu Negócio?",
      "subtitle": "Comece agora mesmo e veja a diferença"
    }
  }
}
```

---

### 2.2 GET `/api/land_beneficios.asp`
Retorna lista de benefícios.

**Response JSON:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "icon": "Calendar",
      "title": "Agendamento Online 24/7",
      "description": "Seus clientes podem agendar a qualquer momento"
    },
    {
      "id": 2,
      "icon": "MessageCircle",
      "title": "WhatsApp Automático",
      "description": "Envio automático de confirmações e lembretes"
    },
    {
      "id": 3,
      "icon": "Users",
      "title": "Múltiplos Profissionais",
      "description": "Gerencie a agenda de toda sua equipe"
    }
  ]
}
```

**Ícones disponíveis (Lucide React):**
- `Calendar`, `Clock`, `Users`, `MessageCircle`, `Globe`, `Shield`
- `Star`, `Check`, `Heart`, `Zap`, `Award`, `TrendingUp`
- `Smartphone`, `Mail`, `MapPin`, `Settings`, `Bell`, `Lock`

---

### 2.3 GET `/api/land_servicos.asp`
Retorna lista de serviços/funcionalidades.

**Response JSON:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "icon": "Calendar",
      "title": "Gestão de Agenda",
      "description": "Controle total sobre seus horários",
      "features": [
        "Visualização por dia, semana e mês",
        "Bloqueio de horários e feriados",
        "Múltiplas agendas simultâneas"
      ]
    },
    {
      "id": 2,
      "icon": "MessageCircle",
      "title": "Comunicação Automática",
      "description": "Mantenha seus clientes informados",
      "features": [
        "Confirmação via WhatsApp",
        "Lembretes automáticos",
        "Mensagens personalizáveis"
      ]
    }
  ]
}
```

---

### 2.4 GET `/api/land_precos.asp`
Retorna planos e preços.

**Response JSON:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Starter",
      "description": "Ideal para profissionais autônomos",
      "price": 49.90,
      "additionalPrice": 29.90,
      "period": "mês",
      "maxProfessionals": 1,
      "popular": false,
      "features": [
        { "text": "Até 1 profissional", "included": true },
        { "text": "Agendamento ilimitado", "included": true },
        { "text": "WhatsApp automático", "included": true },
        { "text": "Página exclusiva", "included": true },
        { "text": "Múltiplas agendas", "included": false },
        { "text": "Relatórios avançados", "included": false }
      ]
    },
    {
      "id": 2,
      "name": "Professional",
      "description": "Para pequenas equipes",
      "price": 89.90,
      "additionalPrice": 24.90,
      "period": "mês",
      "maxProfessionals": 3,
      "popular": true,
      "features": [
        { "text": "Até 3 profissionais", "included": true },
        { "text": "Agendamento ilimitado", "included": true },
        { "text": "WhatsApp automático", "included": true },
        { "text": "Página exclusiva", "included": true },
        { "text": "Múltiplas agendas", "included": true },
        { "text": "Relatórios básicos", "included": true }
      ]
    },
    {
      "id": 3,
      "name": "Enterprise",
      "description": "Para clínicas e salões",
      "price": 149.90,
      "additionalPrice": 19.90,
      "period": "mês",
      "maxProfessionals": 10,
      "popular": false,
      "features": [
        { "text": "Até 10 profissionais", "included": true },
        { "text": "Agendamento ilimitado", "included": true },
        { "text": "WhatsApp automático", "included": true },
        { "text": "Página exclusiva", "included": true },
        { "text": "Múltiplas agendas", "included": true },
        { "text": "Relatórios avançados", "included": true },
        { "text": "API de integração", "included": true }
      ]
    }
  ]
}
```

---

### 2.5 GET `/api/land_plano.asp?id={id}`
Retorna detalhes de um plano específico.

**Parâmetros:**
- `id` (required): ID do plano

**Response JSON:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Professional",
    "description": "Para pequenas equipes",
    "price": 89.90,
    "additionalPrice": 24.90,
    "period": "mês",
    "maxProfessionals": 3,
    "popular": true,
    "features": [
      { "text": "Até 3 profissionais", "included": true },
      { "text": "Agendamento ilimitado", "included": true }
    ]
  }
}
```

---

### 2.6 POST `/api/land_cadastro.asp`
Registra um novo cliente.

**Request JSON:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "empresa": "Consultório Dr. João",
  "segmento": "Saúde",
  "cpf_cnpj": "123.456.789-00",
  "plano_id": 2
}
```

**Response JSON (Sucesso):**
```json
{
  "success": true,
  "message": "Cadastro realizado com sucesso",
  "data": {
    "cliente_id": 123,
    "plano_id": 2,
    "status": "aguardando_pagamento"
  }
}
```

**Response JSON (Erro):**
```json
{
  "success": false,
  "message": "Email já cadastrado",
  "errors": [
    { "field": "email", "message": "Este email já está em uso" }
  ]
}
```

---

### 2.7 POST `/api/land_pagamento.asp`
Processa pagamento.

**Request JSON (PIX):**
```json
{
  "cliente_id": 123,
  "plano_id": 2,
  "metodo": "pix",
  "valor": 89.90
}
```

**Response JSON (PIX):**
```json
{
  "success": true,
  "message": "PIX gerado com sucesso",
  "data": {
    "pagamento_id": 456,
    "metodo": "pix",
    "status": "pendente",
    "pix_code": "00020126580014br.gov.bcb.pix0136...",
    "pix_qrcode": "data:image/png;base64,iVBORw0KGgo...",
    "expira_em": "2024-01-15T23:59:59Z"
  }
}
```

**Request JSON (Cartão):**
```json
{
  "cliente_id": 123,
  "plano_id": 2,
  "metodo": "cartao",
  "valor": 89.90,
  "cartao": {
    "numero": "4111111111111111",
    "nome": "JOAO SILVA",
    "validade": "12/28",
    "cvv": "123"
  }
}
```

**Response JSON (Cartão - Sucesso):**
```json
{
  "success": true,
  "message": "Pagamento aprovado",
  "data": {
    "pagamento_id": 456,
    "metodo": "cartao",
    "status": "aprovado",
    "gateway_id": "pay_abc123",
    "aprovado_em": "2024-01-15T10:30:00Z"
  }
}
```

**Response JSON (Cartão - Erro):**
```json
{
  "success": false,
  "message": "Pagamento recusado",
  "data": {
    "pagamento_id": 456,
    "metodo": "cartao",
    "status": "recusado",
    "motivo": "Cartão sem limite"
  }
}
```

---

### 2.8 GET `/api/land_pagamento_status.asp?id={id}`
Consulta status do pagamento (útil para PIX).

**Parâmetros:**
- `id` (required): ID do pagamento

**Response JSON:**
```json
{
  "success": true,
  "data": {
    "pagamento_id": 456,
    "status": "aprovado",
    "metodo": "pix",
    "aprovado_em": "2024-01-15T10:35:00Z"
  }
}
```

---

## 3. Fluxo de Contratação

```
┌─────────────────┐
│  Landing Page   │
│  (Seleção do    │
│    Plano)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Cadastro     │
│  (Dados do      │
│   Cliente)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Pagamento     │
│  (PIX/Cartão)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────┐
│Sucesso│ │ Erro  │
└───────┘ └───────┘
```

---

## 4. Componentes React Existentes

| Componente | Arquivo | API Utilizada |
|------------|---------|---------------|
| Header | `src/components/landing/Header.tsx` | `land_config.asp` |
| Hero | `src/components/landing/Hero.tsx` | `land_config.asp` |
| Benefits | `src/components/landing/Benefits.tsx` | `land_beneficios.asp` |
| Services | `src/components/landing/Services.tsx` | `land_servicos.asp` |
| Pricing | `src/components/landing/Pricing.tsx` | `land_precos.asp` |
| CTA | `src/components/landing/CTA.tsx` | `land_config.asp` |
| Footer | `src/components/landing/Footer.tsx` | `land_config.asp` |
| Cadastro | `src/pages/Cadastro.tsx` | `land_config.asp`, `land_plano.asp`, `land_cadastro.asp` |
| Pagamento | `src/pages/Pagamento.tsx` | `land_config.asp`, `land_plano.asp`, `land_pagamento.asp` |

---

## 5. Exemplo de API em ASP Classic

### `/api/land_config.asp`
```asp
<%@ Language="VBScript" CodePage="65001" %>
<%
Response.ContentType = "application/json"
Response.Charset = "UTF-8"

Dim conn, rs, json
Set conn = Server.CreateObject("ADODB.Connection")
conn.Open "Driver={MySQL ODBC 8.0 Driver};Server=localhost;Database=datebook;User=user;Password=pass;"

Set rs = conn.Execute("SELECT chave, valor FROM land_config WHERE chave IN ('site_name','site_description','logo_url','contact_email','contact_phone','hero_title','hero_subtitle')")

Dim config
Set config = Server.CreateObject("Scripting.Dictionary")

Do While Not rs.EOF
    config.Add rs("chave"), rs("valor")
    rs.MoveNext
Loop

json = "{"
json = json & """success"": true,"
json = json & """data"": {"
json = json & """name"": """ & config("site_name") & ""","
json = json & """description"": """ & config("site_description") & ""","
json = json & """logo"": """ & config("logo_url") & ""","
json = json & """contact"": {"
json = json & """email"": """ & config("contact_email") & ""","
json = json & """phone"": """ & config("contact_phone") & """"
json = json & "},"
json = json & """hero"": {"
json = json & """title"": """ & config("hero_title") & ""","
json = json & """subtitle"": """ & config("hero_subtitle") & """"
json = json & "}"
json = json & "}"
json = json & "}"

Response.Write json

rs.Close
conn.Close
Set rs = Nothing
Set conn = Nothing
%>
```

---

## 6. Considerações de Segurança

1. **Validação de Dados**
   - Sanitizar todas as entradas do usuário
   - Validar CPF/CNPJ no backend
   - Validar formato de email e telefone

2. **Proteção contra SQL Injection**
   - Usar prepared statements ou parametrização
   - Escapar caracteres especiais

3. **HTTPS**
   - Todas as APIs devem usar HTTPS
   - Dados de cartão devem ser transmitidos de forma segura

4. **CORS**
   - Configurar headers CORS apropriadamente
   - Restringir origens permitidas

5. **Rate Limiting**
   - Implementar limite de requisições por IP
   - Proteger endpoints de pagamento

---

## 7. Próximos Passos

1. [ ] Criar tabelas no banco de dados MySQL
2. [ ] Implementar APIs ASP Classic
3. [ ] Atualizar componentes React para usar APIs reais
4. [ ] Implementar integração com gateway de pagamento (ex: PagSeguro, Stripe)
5. [ ] Configurar servidor de produção
6. [ ] Testar fluxo completo de cadastro e pagamento
7. [ ] Implementar webhooks para confirmação de pagamento PIX

---

## 8. Contato

Para dúvidas sobre a implementação, entre em contato com a equipe de desenvolvimento.
