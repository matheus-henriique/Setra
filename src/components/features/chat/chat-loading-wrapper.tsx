'use client';

import { ReactNode } from 'react';
import { ChatLoading } from './chat-loading';

interface ChatLoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  type?: 'conversations' | 'messages' | 'conversation-detail' | 'users';
  className?: string;
  loadingMessage?: string;
  error?: Error | null;
  errorMessage?: string;
  emptyMessage?: string;
  isEmpty?: boolean;
}

export function ChatLoadingWrapper({
  isLoading,
  children,
  type = 'conversations',
  className,
  loadingMessage,
  error,
  errorMessage,
  emptyMessage,
  isEmpty = false
}: ChatLoadingWrapperProps) {
  // Se está carregando, mostra o loading
  if (isLoading) {
    return (
      <ChatLoading 
        type={type} 
        className={className}
        message={loadingMessage}
      />
    );
  }

  // Se há erro, mostra mensagem de erro
  if (error) {
    return (
      <div className={`flex items-center justify-center h-full w-full ${className || ''}`}>
        <div className="text-center p-8">
          <div className="text-destructive mb-2">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-destructive mb-2">
            Erro ao carregar
          </h3>
          <p className="text-sm text-muted-foreground">
            {errorMessage || 'Ocorreu um erro inesperado. Tente recarregar a página.'}
          </p>
        </div>
      </div>
    );
  }

  // Se está vazio, mostra mensagem de estado vazio
  if (isEmpty) {
    return (
      <div className={`flex items-center justify-center h-full w-full ${className || ''}`}>
        <div className="text-center p-8">
          <div className="text-muted-foreground mb-4">
            <svg className="h-12 w-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg text-foreground mb-2">
            Nenhum conteúdo encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            {emptyMessage || 'Não há dados para exibir no momento.'}
          </p>
        </div>
      </div>
    );
  }

  // Se tudo está ok, renderiza o conteúdo
  return <>{children}</>;
}
