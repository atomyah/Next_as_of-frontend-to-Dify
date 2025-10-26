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

export default async function ChatPage({params}: Params) { // paramsにはスラグ8d83d82b-24c8-4519-b557-d8ac161f263fが入ってる
  const session = await auth()
  const userId = session?.user?.id as string

  const { conversationId } = await params // スラグ8d83d82b-24c8-4519-b557-d8ac161f263fをconversationIdに代入

  return (
    <ChatContainer 
      isNewChat={false}
      initialMessages={[]}
      conversationId={conversationId}
      userId={userId}
    />
  )
}
