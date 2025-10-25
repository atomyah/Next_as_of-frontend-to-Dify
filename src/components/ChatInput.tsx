/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chatを表示するコンテナ（RCC）に埋め込まれているテキスト入力画面
////// ChatContainerから呼び出され、propsでuserIdを受け取っている
////// 
////// また、セクション４-65にて、WorkflowBlocking.tsxを参考にDifyのAPIを呼び出す関数callDifyApiを追加
//////
////// セクション４-69にて、Zustandのチャット用ストアからconversationId, setConversationId, addMessage, setLoading関数を取得するように修正
/////////////////////////////////////////////////////////////////

import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import type {ChatProps} from "@/types/chat"
import React, { useState } from 'react'
import { useChatStore } from "@/store/chatStore"; // Zustandのチャット用ストア
import { useRouter } from 'next/navigation'


export default function ChatInput( {userId}: ChatProps ) {
  const [input, setInput] = useState('')
  // console.log('■ChatInputのuserIdの中身：', userId);
  const router = useRouter();

  // Zustandのチャット用ストアから必要な関数・状態を取得
  const {
    conversationId,
    setConversationId,
    addMessage,
    setLoading,
    resetStore
  } = useChatStore(); 


  const callDifyApi = async (e: React.FormEvent) => { // e: React.FormEventとe.preventDefault()で画面のロードを防止
    e.preventDefault();

    if(!input.trim()) return; // 入力が空の場合は何もしないという、よく使う手口

    try {
        setLoading(true); // ローディング状態をtrueに設定・保持（チャット用ストアの関数）

        addMessage({       // ユーザーのメッセージをチャット用ストアに保持（チャット用ストアの関数）
            role: 'user',
            content: input
        });

        const response = await fetch('/api/chat', {   
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                query: input,    // useStateで入力したinput情報
                userId: userId,  // propsで受け取ったuserIdをDify APIに渡す
                conversationId: conversationId
                // 開始ノードに入力値が複数ある時は下記のようにそれぞれの値を入れる.(api/chat/route.tsも参照のこと)
                // userName: user_name,     // ← これは任意のキー名でOK
                // userAge: age            // ← これも任意のキー名でOK
            })
        })

        const result = await response.json()
        console.log('■ChatInput.tsxにてresult:', result)


        // 会話IDがセットされていなければ設定する（初回会話時）
        if(!conversationId) {
            setConversationId(result.conversation_id); // チャット用ストアの関数でconversationIdをセット
            router.push(`chat/${result.conversation_id}`) // 動的パラメータページにリダイレクト（chat/[conversationId]）
        }

        // Dify APIからの応答をチャット用ストアに保持（チャット用ストアの関数）
        addMessage({
            id: result.message_id,
            role: 'assistant',
            content: result.answer 
        });

        setInput(''); // これで2回目以降の入力に備える


        // console.log('■ChatInput.tsxにてresponse.json()：', result)

    } catch(error) {
      console.error('■ChatInput.tsxにてAPI接続に失敗', error)

    } finally {
      setLoading(false); // ローディング状態をfalseに設定・保持（チャット用ストアの関数）
    }
  }


  return (
    <div>
      <form className="flex flex-col gap-2 px-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <Textarea
                className="flex-1 min-h-[60px] max-h-[200px] text-sm md:text-base bg-white resize-none"
                placeholder="メッセージを入力してください" 
                value={input}
                onChange={(e)=> setInput(e.target.value)}              
              >
            </Textarea>
            <Button type="submit" onClick={callDifyApi} className="h-10 px-4 shrink-0">送信</Button>
        </div>
      </form>
    </div>
  )
}
