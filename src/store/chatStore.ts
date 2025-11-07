/////////////////////////////////////////////////////////////////
////// Zustandを使ったチャットの状態管理ストア
////// 永続化のためにlocalStorageを使用
/////////////////////////////////////////////////////////////////


import { create } from 'zustand'
// localStorageに保存するためのmiddleware。永続化のためのpersistと、JSON形式でlocalStrageに保存するためのcreateJSONStorageをインポート
import { persist, createJSONStorage } from 'zustand/middleware' 

// メッセージの型定義
export type Message = {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
}

// 会話リストの型定義
export type Conversation = {
    id?: string;
    name: string;
    updated_at: number;
}

// ストアの状態の型を定義
interface ChatStore {
    // 状態
    conversationId: string | null;
    isLoading: boolean;
    messages: Message[];
    conversations: Conversation[];

    // アクション
    setConversationId: (id: string | null) => void;
    setMessages: (message: Message[]) => void;
    addMessage: (message: Message) => void;
    clearMessage: () => void;
    setConversations: (conversation: Conversation[]) => void;
    setLoading: (loading: boolean) => void;
    resetStore: () => void
}

// Zustandのストアの作成
// persistを使うために()()と書く(カリー化)
export const useChatStore = create<ChatStore>()(
    // persist(()=>({...}), {...}) の形で使用.第1引数{...}にストアとアクションの定義。第2引数{...}に永続化の設定を渡す
    persist((set)=>({
        // 初期状態
        conversationId: null,
        messages: [],
        conversations: [],
        isLoading: false,

        // アクション
        setConversationId: (id: string | null) => set({ conversationId: id }),
        setMessages: (messages: Message[]) => set({ messages }),
        addMessage: (message: Message) => set((state)=>{
            return { messages: [...state.messages, message]}
        }),
        clearMessage:() => set({messages: []}),
        setConversations: (conversations: Conversation[]) => set({ conversations }),
        
        setLoading: (loading) => set({ isLoading: loading}),
        resetStore:() => set({
            conversationId: null,
            messages: [],
            // resetStoreアクションはログアウトした時以下すべてのストアを初期化する目的で作られたが、
            // 会話リストは保持しておきたいのでコメントアウト（セクション４－７７）
            // conversations: [],
            isLoading: false
        })
    }), {
        name: 'dify-chat-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            conversationId: state.conversationId,
            messages: state.messages,
            conversations: state.conversations
        })
    })
)