// Máscaras para inputs brasileiros

// Máscara de telefone: (11) 99999-9999 ou (11) 9999-9999
export const maskPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

// Máscara de CPF: 000.000.000-00
export const maskCPF = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

// Máscara de CNPJ: 00.000.000/0001-00
export const maskCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
};

// Máscara de CPF/CNPJ com detecção automática
export const maskCpfCnpj = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  
  // Se tiver mais de 11 dígitos, é CNPJ
  if (digits.length > 11) {
    return maskCNPJ(value);
  }
  return maskCPF(value);
};

// Detecta se é PF (CPF) ou PJ (CNPJ)
export const detectDocumentType = (value: string): 'pf' | 'pj' => {
  const digits = value.replace(/\D/g, '');
  return digits.length > 11 ? 'pj' : 'pf';
};

// Máscara de CEP: 00000-000
export const maskCEP = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

// Máscara de UF (estado): converte para maiúsculo e limita a 2 caracteres
export const maskUF = (value: string): string => {
  return value.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de CPF
export const isValidCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '');
  
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false; // Todos dígitos iguais
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  
  return remainder === parseInt(digits[10]);
};

// Validação de CNPJ
export const isValidCNPJ = (cnpj: string): boolean => {
  const digits = cnpj.replace(/\D/g, '');
  
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  if (firstDigit !== parseInt(digits[12])) return false;
  
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  
  return secondDigit === parseInt(digits[13]);
};

// Validação de CPF ou CNPJ
export const isValidCpfCnpj = (value: string): boolean => {
  const digits = value.replace(/\D/g, '');
  
  if (digits.length === 11) return isValidCPF(value);
  if (digits.length === 14) return isValidCNPJ(value);
  return false;
};

// Validação de telefone brasileiro
export const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

// Validação de CEP
export const isValidCEP = (cep: string): boolean => {
  const digits = cep.replace(/\D/g, '');
  return digits.length === 8;
};

// Lista de estados brasileiros
export const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

// Validação de UF
export const isValidUF = (uf: string): boolean => {
  return ESTADOS_BR.includes(uf.toUpperCase() as typeof ESTADOS_BR[number]);
};
