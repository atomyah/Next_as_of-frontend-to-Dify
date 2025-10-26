/////////////////////////////////////////////////////////////////
////// 
////// ChatContainerから呼び出され、propsでuserIdを受け取っている
////// また、セクション４-73にて初回チャット時にChatContainer(RCC)にてconversationId,
////// messagesともに空にするための型定義ChatContainerPropsを追加
/////////////////////////////////////////////////////////////////


import type { Message } from '@/store/chatStore'

export interface ChatContainerProps {
    isNewChat: boolean;
    initialMessages: Message[];
    conversationId?: string | null;
    userId: string
}

// セクション４-73からChatContainerにてChatPropsを使っていたが、
// ChatContainerPropsを使うので以下は不要
export interface ChatProps {
    userId: string;
}