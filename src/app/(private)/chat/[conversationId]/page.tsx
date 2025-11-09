/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chat/8d83d82b-24c8-4519-b557-d8ac161f263f/
////// を表示するページ（RSC）
////// ChatContainerにpropsでuserIdを渡している
////// ちなみにChatSidebarはlayout.tsxに埋め込まれている。
/////  layout.tsxの{children}にこのpage.tsxが入る感じ。
/////
///// セクション４-７３にて、動的ルーティング対応のため(初回チャットと区別する)、conversationIdをparamsから取得するように修正
///// スラグ8d83d82b-24c8-4519-b557-d8ac161f263fの部分をparamsとして取得しconversationIdに代入
/////////////////////////////////////////////////////////////////

import ChatContainer from "@/components/ChatContainer"
import { auth } from "@/auth";


type Params = { //型を指定. Next.js15からparamsがPromise型になった
  params : Promise<{ conversationId: string }>
}

type DifyMessage = {
  id?: string,
  query: string,
  answer: string,
}

type Message = {
    id?: string;
    role: 'user' | 'assistant';
    content: string;
}


// 環境変数の設定
const DIFY_API_KEY = process.env.DIFY_API_KEY
// 会話履歴メッセージ(messages)を取得. 特定の会話内のユーザーとLLMとの実際のやり取り。特定のconversation_idをパラメータとして指定する必要あり
const endpoint = `${process.env.DIFY_API_URL}/messages`    // http://localhost/v1/messages


export default async function ChatPage({params}: Params) { // paramsにはスラグ8d83d82b-24c8-4519-b557-d8ac161f263fが入ってる
  const session = await auth()
  const userId = session?.user?.id as string

  const { conversationId } = await params // スラグ8d83d82b-24c8-4519-b557-d8ac161f263fをconversationIdに代入
  const messages: Message[] = []

  try {                      // 例：http://localhost/v1/messages/user=cmecev79800002lsxlj37zcya&conversation_id=294c341e-3de6-4ecb-b3d1-8c6d6beb8784
      const response = await fetch(`${endpoint}?user=${userId}&conversation_id=${conversationId}`, {    // DifyのAPIからフェッチ。Difyからの返りはresponseに
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DIFY_API_KEY}`
      },
      cache: 'no-store'
    })

      const data = await response.json()  // Difyからの返りはresponse

      if(data.data){
        data.data.forEach((message: DifyMessage) => { // messageはDifyから来るデータ。
          if(message.query) {
            messages.push({
              id: `${message.id}-user`,
              role: 'user',
              content: message.query, 
            })
          }

          if(message.answer) {
            messages.push({
              id: `${message.id}`,
              role: 'assistant',
              content: message.answer, 
            })
          }

        })
      }
      
      console.log('■[conversation_id]/page.tsx内のmessages', messages)
      // 出力結果： 
      // ■[conversation_id]/page.tsx内のmessages: 
      // {0: {id: '8d83d82b-24c8-4519-b557-d8ac161f263f', role: 'user', content: "テストです\n"},
      // {1: {id: 'b1a5f4e3-FILLER-FILLER-FILLER-FILLER', role: 'assistant', content: "何かお手伝いできることがあれば教えてください"},

  } catch(error){
    console.error('メッセージ取得不可', error)
  }

  return (
    <ChatContainer 
      isNewChat={false}
      initialMessages={messages}
      conversationId={conversationId}
      userId={userId}
    />
  )
}
