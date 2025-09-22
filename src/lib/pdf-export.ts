// Utilitários para exportação de conversas em PDF
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

/**
 * Gera HTML formatado para conversa
 */
function generateConversationHTML(
  conversation: Conversation,
  messages: Message[],
  user: User
): string {
  // Lógica para processar externalParticipantIdentifier
  const identifier = conversation.externalParticipantIdentifier || '';
  let name = '';
  let phone = '';
  
  if (identifier.includes(';')) {
    // Formato: "Nome;5511967241512"
    const parts = identifier.split(';');
    name = parts[0]?.trim() || '';
    phone = parts[1]?.trim() || '';
  } else {
    // Formato: "5511967241512" (apenas número)
    phone = identifier.trim();
  }
  
  // Formatar telefone se existir
  const formattedPhone = phone && phone.length >= 11 
    ? `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}`
    : phone;
  
  // Ordenar mensagens por data
  const sortedMessages = [...messages].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const firstMessage = sortedMessages[0];
  const lastMessage = sortedMessages[sortedMessages.length - 1];

  const messageHTML = sortedMessages.map((message, index) => {
    const date = new Date(message.createdAt);
    const isOperator = message.source === 'OPERATOR';
    
    return `
      <div class="message ${isOperator ? 'operator' : 'client'}" style="margin-bottom: 10px; ${isOperator ? 'text-align: right;' : 'text-align: left;'}">
        <div class="message-header" style="font-size: 12px; color: #666; margin-bottom: 5px;">
          ${isOperator ? 'Operador' : 'Cliente'} - ${date.toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
          ${isOperator && message.operatorSender ? ` (${message.operatorSender.name})` : ''}
        </div>
        <div class="message-content" style="
          display: inline-block;
          max-width: 60%;
          padding: 8px 12px;
          border-radius: 12px;
          ${isOperator 
            ? 'background-color: #007bff; color: white; margin-left: auto;' 
            : 'background-color: #f1f3f4; color: #333;'
          }
          word-wrap: break-word;
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.4;
        ">
          ${message.content.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Conversa - ${formattedPhone} - ${name}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #007bff;
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header h2 {
          color: #333;
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
        }
        .header h3 {
          color: #666;
          margin: 0;
          font-size: 16px;
          font-weight: normal;
        }
        .info-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
        }
        .info-label {
          font-weight: bold;
          color: #555;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .info-value {
          color: #333;
          font-size: 14px;
        }
        .messages-section {
          margin-top: 30px;
        }
        .messages-header {
          background-color: #007bff;
          color: white;
          padding: 15px;
          border-radius: 8px 8px 0 0;
          font-weight: bold;
          text-align: center;
        }
        .messages-container {
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 8px 8px;
          padding: 15px;
          min-height: 300px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        .export-info {
          background-color: #e9ecef;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .header { page-break-after: avoid; }
          .info-section { page-break-after: avoid; }
          .message { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Conversa</h1>
        <h2>${formattedPhone || phone || 'Cliente'}${name ? ` - ${name}` : ''}</h2>
        <h3>Sistema SETRA</h3>
      </div>

      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">ID da Conversa</div>
            <div class="info-value">${conversation.id}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Participante</div>
            <div class="info-value">${name || 'Cliente'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Telefone</div>
            <div class="info-value">${formattedPhone || phone || 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">${conversation.status || 'Ativa'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data de Criação</div>
            <div class="info-value">${new Date(conversation.createdAt).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</div>
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Primeira Mensagem</div>
            <div class="info-value">${firstMessage ? new Date(firstMessage.createdAt).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Última Mensagem</div>
            <div class="info-value">${lastMessage ? new Date(lastMessage.createdAt).toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 'N/A'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Total de Mensagens</div>
            <div class="info-value">${messages.length}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Fuso Horário</div>
            <div class="info-value">Brasília (GMT-3)</div>
          </div>
        </div>
      </div>

      <div class="messages-section">
        <div class="messages-header">
          Mensagens da Conversa
        </div>
        <div class="messages-container">
          ${messageHTML}
        </div>
      </div>

      <div class="export-info">
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Exportado por</div>
            <div class="info-value">${user.name} (${user.email})</div>
          </div>
          <div class="info-item">
            <div class="info-label">Data da Exportação</div>
            <div class="info-value">${new Date().toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</div>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>Este relatório foi gerado automaticamente pelo Sistema SETRA</p>
        <p>Todas as datas estão no fuso horário de Brasília (GMT-3)</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Exporta conversa como PDF usando a API nativa do navegador
 */
export function exportConversationAsPDF(
  conversation: Conversation,
  messages: Message[],
  user: User
): void {
  const html = generateConversationHTML(conversation, messages, user);
  
  // Criar e baixar arquivo HTML que pode ser convertido para PDF
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  // Lógica para processar externalParticipantIdentifier
  const identifier = conversation.externalParticipantIdentifier || '';
  let name = '';
  let phone = '';
  
  if (identifier.includes(';')) {
    // Formato: "Nome;5511967241512"
    const parts = identifier.split(';');
    name = parts[0]?.trim() || '';
    phone = parts[1]?.trim() || '';
  } else {
    // Formato: "5511967241512" (apenas número)
    phone = identifier.trim();
  }
  
  const formattedPhone = phone && phone.length >= 11 
    ? `+55-${phone.slice(2, 4)}-${phone.slice(4, 9)}-${phone.slice(9)}`
    : phone;
  const cleanName = (name || 'Cliente').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-');
  const fileName = `Relatorio-Conversa-${formattedPhone || phone || 'Cliente'}-${cleanName}-${timestamp}.pdf`;
  
  // Criar link para download
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.target = '_blank'; // Abrir em nova aba
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Abrir o arquivo em nova aba para visualização/impressão
  const viewWindow = window.open(url, '_blank');
  if (viewWindow) {
    // Aguardar o carregamento e mostrar opção de impressão
    viewWindow.onload = () => {
      setTimeout(() => {
        // Mostrar mensagem para o usuário sobre como imprimir
        if (confirm('Arquivo baixado! Deseja abrir a janela de impressão para salvar como PDF?')) {
          viewWindow.print();
        }
      }, 1000);
    };
  }
  
  // Limpar URL após um tempo
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}

/**
 * Exporta conversa como HTML (alternativa ao PDF)
 */
export function exportConversationAsHTML(
  conversation: Conversation,
  messages: Message[],
  user: User
): void {
  const html = generateConversationHTML(conversation, messages, user);
  
  // Criar e baixar arquivo HTML
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  
  // Lógica para processar externalParticipantIdentifier
  const identifier = conversation.externalParticipantIdentifier || '';
  let name = '';
  
  if (identifier.includes(';')) {
    // Formato: "Nome;5511967241512"
    const parts = identifier.split(';');
    name = parts[0]?.trim() || '';
  }
  
  const cleanName = (name || 'Cliente').replace(/\s+/g, '-');
  const fileName = `conversa-${cleanName}-${timestamp}.html`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Gera HTML para múltiplas conversas
 */
function generateMultipleConversationsHTML(
  conversations: any[],
  user: User
): string {
  const conversationsHTML = conversations.map((conv, index) => {
    // Lógica para processar externalParticipantIdentifier
    const identifier = conv.externalParticipantIdentifier || '';
    let name = '';
    let phone = '';
    
    if (identifier.includes(';')) {
      // Formato: "Nome;5511967241512"
      const parts = identifier.split(';');
      name = parts[0]?.trim() || '';
      phone = parts[1]?.trim() || '';
    } else {
      // Formato: "5511967241512" (apenas número)
      phone = identifier.trim();
    }
    
    const formattedPhone = phone && phone.length >= 11 
      ? `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}`
      : phone;
    
    return `
      <div class="conversation-item" style="
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        background-color: #f8f9fa;
      ">
        <div class="conversation-header" style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        ">
          <h3 style="margin: 0; color: #007bff;">${name}</h3>
          <span style="
            background-color: #007bff;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
          ">#${index + 1}</span>
        </div>
        <div class="conversation-info" style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          font-size: 14px;
        ">
          <div><strong>ID:</strong> ${conv.id}</div>
          <div><strong>Telefone:</strong> ${formattedPhone}</div>
          <div><strong>Criada em:</strong> ${new Date(conv.createdAt).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })}</div>
          <div><strong>Mensagens:</strong> ${conv.messageCount || '0'}</div>
          <div><strong>Status:</strong> ${conv.status || 'Ativa'}</div>
          <div><strong>Operador:</strong> ${conv.operator || 'N/A'}</div>
        </div>
        ${conv.lastMessage ? `
          <div class="last-message" style="
            margin-top: 10px;
            padding: 10px;
            background-color: white;
            border-radius: 4px;
            border-left: 3px solid #007bff;
          ">
            <strong>Última mensagem:</strong><br>
            ${conv.lastMessage}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório de Conversas - ${conversations.length} conversas - Sistema SETRA</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #007bff;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #007bff;
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .summary {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: center;
        }
        .export-info {
          background-color: #e9ecef;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .header { page-break-after: avoid; }
          .conversation-item { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório de Conversas</h1>
        <h2>${conversations.length} conversas encontradas</h2>
        <h3>Sistema SETRA</h3>
      </div>

      <div class="summary">
        <h3>Resumo</h3>
        <p><strong>Total de conversas:</strong> ${conversations.length}</p>
        <p><strong>Data da exportação:</strong> ${new Date().toLocaleString('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })}</p>
      </div>

      <div class="conversations-list">
        ${conversationsHTML}
      </div>

      <div class="export-info">
        <p><strong>Exportado por:</strong> ${user.name} (${user.email})</p>
        <p><strong>Função:</strong> ${user.roles.join(', ')}</p>
      </div>

      <div class="footer">
        <p>Este relatório foi gerado automaticamente pelo Sistema SETRA</p>
        <p>Todas as datas estão no fuso horário de Brasília (GMT-3)</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Exporta múltiplas conversas como PDF
 */
export function exportMultipleConversationsAsPDF(
  conversations: any[],
  user: User
): void {
  const html = generateMultipleConversationsHTML(conversations, user);
  
  // Criar e baixar arquivo HTML que pode ser convertido para PDF
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `Relatorio-Multiplas-Conversas-${conversations.length}-conversas-${timestamp}.pdf`;
  
  // Criar link para download
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.target = '_blank'; // Abrir em nova aba
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Abrir o arquivo em nova aba para visualização/impressão
  const viewWindow = window.open(url, '_blank');
  if (viewWindow) {
    // Aguardar o carregamento e mostrar opção de impressão
    viewWindow.onload = () => {
      setTimeout(() => {
        // Mostrar mensagem para o usuário sobre como imprimir
        if (confirm('Arquivo baixado! Deseja abrir a janela de impressão para salvar como PDF?')) {
          viewWindow.print();
        }
      }, 1000);
    };
  }
  
  // Limpar URL após um tempo
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000);
}

/**
 * Exporta múltiplas conversas como HTML
 */
export function exportMultipleConversationsAsHTML(
  conversations: any[],
  user: User
): void {
  const html = generateMultipleConversationsHTML(conversations, user);
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileName = `relatorio-conversas-${timestamp}.html`;
  
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
