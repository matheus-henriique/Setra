// src/components/features/chat/message-view.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/uth-context';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Download, MessageSquare, User, Bot, FileText } from 'lucide-react';
import { ChatLoadingWrapper } from '@/components/features/chat';
import { exportConversationAsPDF, exportConversationAsHTML } from '@/lib/pdf-export';

async function fetchMessages(conversationId: string) {
  return api(`/conversations/${conversationId}/messages`);
}

async function fetchConversation(conversationId: string) {
  const conversations = await api('/conversations');
  return conversations.find((conv: any) => conv.id === conversationId);
}

export function MessageView({ 
  conversationId, 
  onBackToList 
}: { 
  conversationId: string | null;
  onBackToList?: () => void;
}) {
  const { user } = useAuth();
  const { data: messages, isLoading, error } = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId!),
    enabled: !!conversationId, // Só busca as mensagens se um ID for selecionado
  });

  const { data: conversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: () => fetchConversation(conversationId!),
    enabled: !!conversationId,
  });

  const handleExportAsPDF = () => {
    if (!conversation || !messages || !user) return;
    
    try {
      exportConversationAsPDF(conversation, messages, user);
    } catch (error) {
      console.error('Erro ao exportar conversa como PDF:', error);
    }
  };

  const handleExportAsHTML = () => {
    if (!conversation || !messages || !user) return;
    
    try {
      exportConversationAsHTML(conversation, messages, user);
    } catch (error) {
      console.error('Erro ao exportar conversa como HTML:', error);
    }
  };

  if (!conversationId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="mt-2">As mensagens da conversa serão exibidas aqui</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ChatLoadingWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={!messages || messages.length === 0}
      type="messages"
      className="h-full"
      errorMessage="Erro ao carregar mensagens. Tente recarregar a página."
      emptyMessage="As mensagens aparecerão aqui quando forem enviadas"
    >
      <div className="flex flex-col h-full max-h-screen">
        {/* Cabeçalho da Conversa */}
        <div className="p-4 border-b flex-shrink-0 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {onBackToList && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToList}
                  className="p-1 h-8 w-8 hover:bg-primary/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-base md:text-lg">
                  {conversation?.externalParticipantIdentifier ? (() => {
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
                    
                    return (
                      <span>
                        <span className="font-semibold">{formattedPhone || phone || 'Cliente'}</span>
                        {name && (
                          <span className="text-sm font-medium text-muted-foreground ml-2">- {name}</span>
                        )}
                      </span>
                    );
                  })() : 'Conversa'}
                </h2>
              </div>
            </div>
            
            {conversationId && (
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExportAsPDF}
                        className="p-1 h-8 w-8"
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white border-gray-600">
                      <p>Exportar como PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExportAsHTML}
                        className="p-1 h-8 w-8"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white border-gray-600">
                      <p>Exportar como HTML</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
            )}
          </div>
        </div>

        {/* Área das Mensagens com Scroll */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages?.map((message: any) => (
                <div key={message.id} className={cn('flex items-end gap-2', message.source === 'OPERATOR' ? 'justify-end' : 'justify-start')}>
                  {/* Balão da Mensagem */}
                  <div
                    className={cn('max-w-xs rounded-lg p-3 text-sm',
                      message.source === 'OPERATOR'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex-1">
                        {message.content}
                      </div>
                      <div className="flex items-center text-xs whitespace-nowrap">
                        <span className={cn(
                          message.source === 'OPERATOR'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Avatar do Operador */}
                  {message.source === 'OPERATOR' && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white border-gray-600">
                          <p>{user?.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        {/* Área de informações sobre envio de mensagens */}
        <div className="p-4 border-t flex-shrink-0">
          <div className="text-center text-muted-foreground text-sm">
            <p>Você está vizualizando logs de conversa. Não é possível enviar mensagens por aqui.</p>
          </div>
        </div>
      </div>
    </ChatLoadingWrapper>
  );
}