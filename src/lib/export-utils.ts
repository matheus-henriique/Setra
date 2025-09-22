// Utilitários para exportação jurídica de conversas
'use client';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface Message {
  id: string;
  content: string;
  source: 'OPERATOR' | 'EXTERNAL';
  createdAt: string;
  operatorSender?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Conversation {
  id: string;
  externalParticipantIdentifier: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
}

interface ExportMetadata {
  exportedBy: User;
  exportedAt: string;
  conversationId: string;
  totalMessages: number;
  dateRange: {
    start: string;
    end: string;
  };
}

/**
 * Gera cabeçalho jurídico completo para exportação
 */
export function generateLegalHeader(
  conversation: Conversation,
  messages: Message[],
  metadata: ExportMetadata
): string[] {
  const [name, phone] = conversation.externalParticipantIdentifier.split(';');
  const formattedPhone = phone ? `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}` : '';
  
  // Ordenar mensagens por data para obter range
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const firstMessage = sortedMessages[0];
  const lastMessage = sortedMessages[sortedMessages.length - 1];
  
  return [
    '='.repeat(80),
    'RELATÓRIO JURÍDICO DE CONVERSA - SISTEMA SETRA',
    '='.repeat(80),
    '',
    'INFORMAÇÕES DA CONVERSA:',
    `ID da Conversa: ${conversation.id}`,
    `Participante: ${name}`,
    `Telefone: ${formattedPhone}`,
    `Data de Criação: ${new Date(conversation.createdAt).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`,
    `Última Atualização: ${new Date(conversation.updatedAt).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`,
    `Status: ${conversation.status || 'Ativa'}`,
    '',
    'PERÍODO DAS MENSAGENS:',
    `Primeira Mensagem: ${firstMessage ? new Date(firstMessage.createdAt).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : 'N/A'}`,
    `Última Mensagem: ${lastMessage ? new Date(lastMessage.createdAt).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : 'N/A'}`,
    `Total de Mensagens: ${messages.length}`,
    '',
    'INFORMAÇÕES DA EXPORTAÇÃO:',
    `Exportado por: ${metadata.exportedBy.name} (${metadata.exportedBy.email})`,
    `Cargo/Função: ${metadata.exportedBy.roles.join(', ')}`,
    `Data/Hora da Exportação: ${new Date(metadata.exportedAt).toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`,
    `ID do Usuário Exportador: ${metadata.exportedBy.id}`,
    '',
    'OBSERVAÇÕES LEGAIS:',
    '- Este documento foi gerado automaticamente pelo sistema SETRA',
    '- Todas as mensagens foram preservadas em sua forma original',
    '- As datas e horários estão no fuso horário de Brasília (GMT-3)',
    '- Este relatório possui valor jurídico e pode ser utilizado em processos legais',
    '- A integridade dos dados foi mantida durante a exportação',
    '',
    '='.repeat(80),
    'INÍCIO DAS MENSAGENS',
    '='.repeat(80),
    ''
  ];
}

/**
 * Gera dados das mensagens formatados para CSV jurídico
 */
export function generateMessageData(messages: Message[]): string[][] {
  // Ordenar mensagens por data
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return sortedMessages.map((message, index) => {
    const date = new Date(message.createdAt);
    
    return [
      // Número sequencial da mensagem
      (index + 1).toString(),
      
      // Data completa com timezone
      date.toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      
      // Data em formato ISO para referência técnica
      date.toISOString(),
      
      // Timestamp Unix
      Math.floor(date.getTime() / 1000).toString(),
      
      // Origem da mensagem
      message.source === 'OPERATOR' ? 'Operador' : 'Cliente',
      
      // Informações do operador (se aplicável)
      message.operatorSender?.name || '',
      message.operatorSender?.email || '',
      message.operatorSender?.id || '',
      
      // ID da mensagem
      message.id,
      
      // Conteúdo da mensagem (escapado para CSV)
      `"${message.content.replace(/"/g, '""')}"`,
      
      // Tamanho da mensagem em caracteres
      message.content.length.toString(),
      
      // Tipo de mensagem (texto por enquanto, pode ser expandido)
      'Texto',
      
      // Status da mensagem
      'Enviada'
    ];
  });
}

/**
 * Gera cabeçalho das colunas do CSV
 */
export function generateCSVHeaders(): string[] {
  return [
    'Número',
    'Data/Hora (Brasília)',
    'Data/Hora (ISO)',
    'Timestamp Unix',
    'Origem',
    'Nome do Operador',
    'Email do Operador',
    'ID do Operador',
    'ID da Mensagem',
    'Conteúdo',
    'Tamanho (caracteres)',
    'Tipo',
    'Status'
  ];
}

/**
 * Função principal para exportar conversa com fins jurídicos
 */
export function exportConversationForLegal(
  conversation: Conversation,
  messages: Message[],
  user: User
): void {
  const metadata: ExportMetadata = {
    exportedBy: user,
    exportedAt: new Date().toISOString(),
    conversationId: conversation.id,
    totalMessages: messages.length,
    dateRange: {
      start: messages.length > 0 ? messages[0].createdAt : '',
      end: messages.length > 0 ? messages[messages.length - 1].createdAt : ''
    }
  };

  // Gerar cabeçalho jurídico
  const header = generateLegalHeader(conversation, messages, metadata);
  
  // Gerar dados das mensagens
  const messageData = generateMessageData(messages);
  const csvHeaders = generateCSVHeaders();
  
  // Combinar tudo
  const csvContent = [
    ...header,
    csvHeaders.join(','),
    ...messageData.map(row => row.join(','))
  ].join('\n');

  // Gerar nome do arquivo com timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const [name] = conversation.externalParticipantIdentifier.split(';');
  const fileName = `relatorio-juridico-${name.replace(/\s+/g, '-')}-${timestamp}.csv`;

  // Download do arquivo
  const blob = new Blob([csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Função para exportar múltiplas conversas (dashboard)
 */
export function exportMultipleConversationsForLegal(
  conversations: any[],
  user: User
): void {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  const header = [
    '='.repeat(80),
    'RELATÓRIO JURÍDICO DE MÚLTIPLAS CONVERSAS - SISTEMA SETRA',
    '='.repeat(80),
    '',
    'INFORMAÇÕES DA EXPORTAÇÃO:',
    `Exportado por: ${user.name} (${user.email})`,
    `Cargo/Função: ${user.roles.join(', ')}`,
    `Data/Hora da Exportação: ${new Date().toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })}`,
    `ID do Usuário Exportador: ${user.id}`,
    `Total de Conversas: ${conversations.length}`,
    '',
    'OBSERVAÇÕES LEGAIS:',
    '- Este documento foi gerado automaticamente pelo sistema SETRA',
    '- Lista de conversas com informações básicas para fins jurídicos',
    '- Para detalhes completos, exporte cada conversa individualmente',
    '- As datas estão no fuso horário de Brasília (GMT-3)',
    '',
    '='.repeat(80),
    'LISTA DE CONVERSAS',
    '='.repeat(80),
    ''
  ];

  const csvHeaders = [
    'ID da Conversa',
    'Cliente',
    'Telefone',
    'Data de Criação',
    'Última Atualização',
    'Status',
    'Total de Mensagens',
    'Última Mensagem',
    'Operador Responsável'
  ];

  const csvData = conversations.map(conv => {
    const [name, phone] = conv.externalParticipantIdentifier.split(';');
    const formattedPhone = phone ? `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}` : '';
    
    return [
      conv.id,
      `"${name}"`,
      formattedPhone,
      new Date(conv.createdAt).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      new Date(conv.updatedAt).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      conv.status || 'Ativa',
      conv.messageCount || '0',
      conv.lastMessage || 'N/A',
      conv.operator || 'N/A'
    ];
  });

  const csvContent = [
    ...header,
    csvHeaders.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const fileName = `relatorio-juridico-multiplas-conversas-${timestamp}.csv`;

  const blob = new Blob([csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
