/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chatを表示するコンテナ（RCC）に埋め込まれているテキスト入力画面
////// ChatContainerから呼び出され、propsでuserIdを受け取っている
////// 
////// また、セクション４-65にて、WorkflowBlocking.tsxを参考にDifyのAPIを呼び出す関数callDifyApiを追加
//////
////// セクション４-69にて、Zustandのチャット用ストアからconversationId, setConversationId, addMessage, setLoading関数を取得するように修正
//////
////// セクション４-72にて、Zustandのmessagesの内容（チャット履歴）を画面に表示。messagesはChatInput.tsxでaddMessageアクションで会話が追加されている
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

  // Zustandのチャット用ストアからここで使う関数・状態をインポート
  //   Zustandのストア：
  //   - **目的**：画面にメッセージを表示する
  //   - **保存場所**：ブラウザのlocalStorage + メモリ
  //   - **用途**：現在開いているチャット画面の表示
  const {
    conversationId,   // １．初回はZustandの初期値null
    setConversationId,
    addMessage,
    setLoading,
    resetStore
  } = useChatStore(); 


  const callDifyApi = async (e: React.FormEvent) => { // e: React.FormEventとe.preventDefault()で画面のロードを防止
    e.preventDefault();

    if(!input.trim()) return; // 入力が空の場合は何もしないという、よく使う手口

    try {
        setLoading(true); // ローディング状態をloadingをtrueに設定・保持（チャット用ストアの関数）

        addMessage({       // ユーザーのクエリをチャット用ストアMessageに保持（チャット用ストアの関数）
            role: 'user',  // このMessageはあくまでブラウザ画面に表示するために使う（Difyの会話履歴メッセージ(messages)と別物）
            content: input
        });

        const response = await fetch('/api/chat', {   // /api/chat/route.tsを呼んでる
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                query: input,    // useStateで入力したinput情報
                userId: userId,  // propsで受け取ったuserIdをDify APIに渡す
                conversationId: conversationId  // ２．Zustandから取得したconversationIdをDify APIに渡す(初回会話ではnull)
                                                // ５．２回目以降はZustandに保存されたconversationIdが入っている
                // 開始ノードに入力値が複数ある時は下記のようにそれぞれの値を入れる.(api/chat/route.tsも参照のこと)
                // userName: user_name,     // ← これは任意のキー名でOK
                // userAge: age            // ← これも任意のキー名でOK
            })
        })

        // Difyからの応答
        const result = await response.json()
        console.log('■ChatInput.tsxにてresult:', result)
        // 出力結果：
        // result = {
        //     conversation_id: "abc123...",  // ← ３．復路なのでconversation_idがある
        //     answer: "こんにちは！",
        //     ...
        // }        


        // 会話IDがセットされていなければ設定する（初回会話時）
        if(!conversationId) {
            setConversationId(result.conversation_id); // ４．ZustandにsetConversationId()でconversationIdを保存
            router.push(`chat/${result.conversation_id}`) // 動的パラメータページにリダイレクト（chat/[conversationId]）
        }

        // Difyからの回答をチャット用ストアにMessage保持（チャット用ストアの関数）
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
      setLoading(false); // ローディング状態loadingをfalseに設定・保持（チャット用ストアの関数）
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
