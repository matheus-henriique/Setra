// src/components/features/users/user-table.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DataTable } from '@/components/features/dashboard/data-table';
import { ChatLoadingWrapper } from '@/components/features/chat';


interface User {
  id: string;
  name: string;
  email: string;
  selected_theme: string;
  createdAt: string;
  userRoles: {
    role: {
      name: string;
    };
  }[];
}

async function fetchUsers(): Promise<User[]> {
  return api('/users');
}

export function UserTable() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <ChatLoadingWrapper
      isLoading={isLoading}
      error={error}
      isEmpty={!users || users.length === 0}
      type="users"
      className="py-6"
      errorMessage="Ocorreu um erro ao buscar os usuários. Tente recarregar a página."
      emptyMessage="Nenhum usuário encontrado no sistema."
    >
      <div className='py-6'>
        <DataTable data={users || []} />
      </div>
    </ChatLoadingWrapper>
  );
}