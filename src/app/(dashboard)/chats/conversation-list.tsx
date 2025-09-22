// src/components/features/chat/conversation-list.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Clock, User } from 'lucide-react';
import { ChatLoadingWrapper } from '@/components/features/chat';

async function fetchConversations() {
  return api('/conversations');
}

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export function ConversationList({
  selectedConversationId,
  onSelectConversation,
}: ConversationListProps) {
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  return (
    <ChatLoadingWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={!conversations || conversations.length === 0}
      type="conversations"
      className="h-32"
      errorMessage="Erro ao carregar conversas. Tente recarregar a página."
      emptyMessage="As conversas aparecerão aqui quando forem iniciadas"
    >
      <div className="flex-1 min-h-0 w-full">
        <ScrollArea className="h-full w-full">
          <div className="flex flex-col gap-2 p-2 w-full">
            {conversations?.map((convo: any) => {
              const [name, phone] = convo.externalParticipantIdentifier.split(';');
              const formattedPhone = phone ? `+55 (${phone.slice(2, 4)}) ${phone.slice(4, 9)}-${phone.slice(9)}` : '';
              const isSelected = selectedConversationId === convo.id;
              
              return (
                <Card 
                  key={convo.id}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:shadow-md border-0 bg-card/50 backdrop-blur-sm w-full',
                    isSelected && 'ring-2 ring-primary/20 bg-primary/5 shadow-md'
                  )}
                  onClick={() => onSelectConversation(convo.id)}
                >
                  <CardContent className="p-3 w-full">
                    <div className="flex items-start gap-2 w-full">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          <User className="h-3 w-3" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-col gap-1 mb-1 w-full">
                          <h3 className="font-semibold text-xs truncate w-full">
                            {formattedPhone}
                          </h3>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground w-full">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(convo.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                          <span className="flex-shrink-0">às</span>
                          <span className="flex-shrink-0">
                            {new Date(convo.createdAt).toLocaleTimeString('pt-BR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </ChatLoadingWrapper>
  );
}