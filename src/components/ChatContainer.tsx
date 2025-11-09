/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chatを表示するコンテナ（RCC）
////// (private)/chat/page.tsxから呼び出され、propsでuserIdを受け取っている
////// ここでChatInputを埋め込みpropsでuserIdを渡している
//////
////// セクション４－74にて、新規チャットの場合は会話ストアをリセットするため、
////// types/chat.tsで定義したisNewChatやinitialMessagesなどをpropsで受け取るように修正。
////// 投げ元は(private)/chat/page.tsxおよび(private)/chat/[conversationId]/page.tsx
/////////////////////////////////////////////////////////////////

'use client'

import ChatInput from "./ChatInput";
import type {ChatContainerProps} from "@/types/chat"
import { useEffect, useRef} from 'react'
import { useChatStore } from '@/store/chatStore'

export default function ChatContainer({
  isNewChat,
  userId,
  initialMessages, 
  conversationId
}: ChatContainerProps) {
  
  const { 
    messages, 
    isLoading,
    conversationId: storeConversationId,
    setConversationId,
    setMessages,
    clearMessage
  } = useChatStore(); // Zustandのmessagesからメッセージ一覧とloadingからロディング状態を取得
  


  
  ///// 以下、自動スクロールのための呪文 /////
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'})
  }, [messages]) // Zustandのストアmessagesが更新されるたびにスクロールされる
  // messagesEndRefはuseRefを使った参照ポイント。下の<div ref={messagesEndRef} />で使用
  ///// 以下、自動スクロールのための呪文～ここまで /////


  useEffect(()=>{
    if(isNewChat){ 
        clearMessage()
        setConversationId('') 
    }
    // propsからconversationIdがあれば設定
    if(conversationId){
      setConversationId(conversationId) 
    }
    // propsでinitialMesssagesがあれば設定
    if(initialMessages && initialMessages.length > 0 ){
      setMessages(initialMessages) }
  },[isNewChat, clearMessage, setConversationId, conversationId, setMessages])




  return (
    <div className="flex flex-col h-full">
      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* <div className="flex items-start justify-end">
            <div className="bg-white rounded-lg my-2 py-3 px-4">
                <p className="text-gray-800">ここに文章が入ります</p>
            </div>
        </div> */}


        {messages.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 my-12">
            <p>メッセージを送信してください</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start' } mb-4 
            `}><div className={`rounded-mg py-3 px-4 max-w-[80%] ${
              message.role === 'user' 
              ? 'bg-blue-100 text-gray-800 rounded-lg'
              : 'bg-white text-gray-800 rounded-lg' }`}>

                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        ) }


        {/* スクロールのための参照ポイント useRefでの参照ポイントを可能にしている */}
        <div ref={messagesEndRef} />


        {/* ローディングインジケーター */}
        {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-white text-gray-800 px-4 py-3 rounded-lg rounded-tl-none">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animationdelay:
                0.2s]"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animationdelay:
                0.4s]"></div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* 入力エリア */}
      <div className="flex-shrink-0 border-t py-4">
        <ChatInput userId={userId} />
      </div>
    </div>
  )
}
