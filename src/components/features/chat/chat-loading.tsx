'use client';

import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Users, Bot, UserCheck, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatLoadingProps {
  type?: 'conversations' | 'messages' | 'conversation-detail' | 'users' | 'dashboard-conversations';
  className?: string;
  message?: string;
}

export function ChatLoading({ 
  type = 'conversations', 
  className,
  message 
}: ChatLoadingProps) {
  const getLoadingContent = () => {
    switch (type) {
      case 'conversations':
        return {
          icon: <Users className="h-8 w-8 text-primary/60" />,
          title: 'Carregando conversas...',
          description: 'Buscando suas conversas recentes',
          defaultMessage: message || 'Aguarde enquanto carregamos suas conversas'
        };
      case 'messages':
        return {
          icon: <MessageSquare className="h-8 w-8 text-primary/60" />,
          title: 'Carregando mensagens...',
          description: 'Buscando mensagens da conversa',
          defaultMessage: message || 'Aguarde enquanto carregamos as mensagens'
        };
      case 'conversation-detail':
        return {
          icon: <Bot className="h-8 w-8 text-primary/60" />,
          title: 'Carregando detalhes...',
          description: 'Buscando informações da conversa',
          defaultMessage: message || 'Aguarde enquanto carregamos os detalhes'
        };
      case 'users':
        return {
          icon: <UserCheck className="h-8 w-8 text-primary/60" />,
          title: 'Carregando usuários...',
          description: 'Buscando lista de usuários',
          defaultMessage: message || 'Aguarde enquanto carregamos os usuários'
        };
      case 'dashboard-conversations':
        return {
          icon: <Database className="h-8 w-8 text-primary/60" />,
          title: 'Carregando conversas...',
          description: 'Buscando conversas recentes',
          defaultMessage: message || 'Aguarde enquanto carregamos as conversas'
        };
      default:
        return {
          icon: <MessageSquare className="h-8 w-8 text-primary/60" />,
          title: 'Carregando...',
          description: 'Aguarde um momento',
          defaultMessage: message || 'Carregando conteúdo'
        };
    }
  };

  const content = getLoadingContent();

  return (
    <div className={cn('flex items-center justify-center h-full w-full', className)}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            {/* Ícone animado */}
            <div className="relative">
              {content.icon}
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="sm" className="text-primary/40" />
              </div>
            </div>
            
            {/* Conteúdo do loading */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-foreground">
                {content.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {content.description}
              </p>
            </div>
            
            {/* Spinner principal */}
            <div className="flex items-center gap-2">
              <Spinner size="default" />
              <span className="text-xs text-muted-foreground">
                {content.defaultMessage}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente específico para loading de conversas
export function ConversationsLoading({ className }: { className?: string }) {
  return (
    <ChatLoading 
      type="conversations" 
      className={className}
    />
  );
}

// Componente específico para loading de mensagens
export function MessagesLoading({ className }: { className?: string }) {
  return (
    <ChatLoading 
      type="messages" 
      className={className}
    />
  );
}

// Componente específico para loading de detalhes da conversa
export function ConversationDetailLoading({ className }: { className?: string }) {
  return (
    <ChatLoading 
      type="conversation-detail" 
      className={className}
    />
  );
}

// Componente específico para loading de usuários
export function UsersLoading({ className }: { className?: string }) {
  return (
    <ChatLoading 
      type="users" 
      className={className}
    />
  );
}

// Componente específico para loading de conversas do dashboard
export function DashboardConversationsLoading({ className }: { className?: string }) {
  return (
    <ChatLoading 
      type="dashboard-conversations" 
      className={className}
    />
  );
}
