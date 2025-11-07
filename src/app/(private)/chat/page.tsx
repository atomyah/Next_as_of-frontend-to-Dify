/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chatを表示するページ（RSC）
////// ChatContainerにpropsでuserIdを渡している
////// ちなみにChatInputはChatContainerに埋め込まれている
////// ChatSidebarはlayout.tsxに埋め込まれている。
/////  layout.tsxの{children}にこのpage.tsxが入る感じ。
/////////////////////////////////////////////////////////////////

import ChatContainer from "@/components/ChatContainer"
import { auth } from "@/auth";

export default async function ChatPage() {
  const session = await auth()
  const userId = session?.user?.id as string

  return (
    <ChatContainer 
      isNewChat={true}
      initialMessages={[]}
      conversationId={null}
      userId={userId}
    />
  )
}
