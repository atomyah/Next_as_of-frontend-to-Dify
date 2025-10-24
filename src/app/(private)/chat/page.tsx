/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chatを表示するページ（RSC）
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
