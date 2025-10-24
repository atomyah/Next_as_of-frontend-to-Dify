/////////////////////////////////////////////////////////////////
////// http://localhost:3000/chatを表示するコンテナ（RCC）に埋め込まれているテキスト入力画面
////// ChatContainerから呼び出され、propsでuserIdを受け取っている
/////////////////////////////////////////////////////////////////

import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import type {ChatProps} from "@/types/chat"

export default function ChatInput( {userId}: ChatProps ) {
  // console.log('■ChatInputのuserIdの中身：', userId);
  return (
    <div>
      <form className="flex flex-col gap-2 px-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
            <Textarea
                className="flex-1 min-h-[60px] max-h-[200px] text-sm md:text-base bg-white resize-none"
                placeholder="メッセージを入力してください">
            </Textarea>
            <Button type="submit" className="h-10 px-4 shrink-0">送信</Button>
        </div>
      </form>
    </div>
  )
}
