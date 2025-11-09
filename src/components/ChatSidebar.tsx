/////////////////////////////////////////////////////////////////////////
////// (private)/chat/配下ページのレイアウト。
////// propsでuserIdを渡している(セクション４－７５)
////// app/(private)/chat/layout.tsxで、<ChatSidebar userId={userId} />のように呼び出されている
////// セクション４－７６、７７で会話履歴取得。
////// await fetch(`/api/conversations?userId=${userId}`)でapi/conversations/route.tsをルートハンドラーを叩いてる
/////////////////////////////////////////////////////////////////////////
'use client';

import { ChatProps } from "@/types/chat";
import { useEffect, useState } from "react";
import { useChatStore, Conversation } from "@/store/chatStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react"; // Shadcn UIのアイコン
import { Button } from "@/components/ui/button";

export default function ChatSidebar({userId}: ChatProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { setConversations, conversations, conversationId, resetStore } = useChatStore(); // Zustandから各ストアの値を受け取る

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/conversations?userId=${userId}`)
      const data = await response.json()

      console.log('■ChatSidebarにて、data.data:', data.data);
      // 出力結果： 
      // ■ChatSidebarにて、data.data: 
      // {0: {id: '8d83d82b-24c8-4519-b557-d8ac161f263f', name: 'Performing a test', updated_at: 1710849988},
      // {1: {id: 'b1a5f4e3-FILLER-FILLER-FILLER-FILLER', name: 'テストについての確認', updated_at: 1761718877},

      if(data.data){
        const formattedConversations = data.data.map((conv:Conversation) => ({
          id: conv.id,
          name: conv.name,
          updatedAt: conv.updated_at * 1000 // Dify APIからはupdated_atというキー名で返ってくる（「curlコマンドと出力結果.txt」を参照）
        }));
        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('■ChatSidebarにて、会話リストの取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // ESLintでワーニングが出るのでコメントで対応
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchConversations();
  }, []); // 初回ロード時のみ実行



  const handleNewChat = () => {
    resetStore();
    router.push('/chat');
  }



  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4">
        <Button onClick={handleNewChat} 
            className="bg-indigo-700 w-full">
          <Plus size={16} /><span>新規チャット</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4">
        <h3 className="text-base text-indigo-700 font-medium mb-4">会話履歴</h3>
        {isLoading && conversations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">読み込み中...</div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">会話がありません</div>
        ) : (
          <ul className="space-y-1">
            {conversations.map((conversation) => (
              <li key={conversation.id} className="relative">
                <Link href={`/chat/${conversation.id}`}
                  className={`
                    flex items-center p-2 my-2 text-sm rounded-lg hover:bg-indigo-200
                    ${conversationId === conversation.id ? 'bg-indigo-500 text-white' : ''}`}
                    // conversationId（現在開いている会話のID）と conversation.id（リスト内の各会話のID）が一致する時（それを選択している時）bg-indigo-500 text-whiteを適用
                    // conversationIdは２３行目const { conversationId } = useChatStore()で読み取っている。
                  >
                    <div className="flex-1">
                      <p className="truncate font-medium">{conversation.name}</p>
                    </div>
                  </Link>
              </li>
            ))}

          </ul>
      )}
      </div>
    </div>
  )
}
