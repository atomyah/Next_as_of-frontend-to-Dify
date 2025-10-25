/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chat/8d83d82b-24c8-4519-b557-d8ac161f263f/
////// を表示するページ（RSC）
////// ChatContainerにpropsでuserIdを渡している
////// ちなみにChatSidebarはlayout.tsxに埋め込まれている。
/////  layout.tsxの{children}にこのpage.tsxが入る感じ。
/////////////////////////////////////////////////////////////////

import ChatContainer from "@/components/ChatContainer"
import { auth } from "@/auth";

export default async function ChatPage() {
  const session = await auth()
  const userId = session?.user?.id as string

  return (
    <ChatContainer userId={userId} />
  )
}
