// src/app/(dashboard)/chats/page.tsx
"use client"

import { ChatLayout } from "@/app/(dashboard)/chats/chat-layout";
import { RouteGuard } from "@/components/auth/route-guard";

export default function ChatsPage() {
  // A página em si só precisa renderizar o layout do chat
  // que por sua vez fica dentro do layout principal do dashboard
  return (
    <RouteGuard requiredRoles={['admin', 'support', 'operator']}>
      <ChatLayout />
    </RouteGuard>
  );
}