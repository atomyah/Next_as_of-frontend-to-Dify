/////////////////////////////////////////////////////////////////
////// components/layouts/PrivateHeader.tsxに埋め込まれるログアウト＆ドロップダウンメニューコンポーネント
/////////////////////////////////////////////////////////////////
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"
import { Session } from "next-auth" 

export default function Setting({session}: {session: Session}) {
  // PrivateHeader.tsxコンポーネントの<Setting session={session} />から渡ってきたユーザー情報がsessionに格納されている
  // session変数には、 PrivateHeader.tsxの次のコード → const session = await auth() で格納された。
    // sessionの中身：
    //  {
    //     "user": {
    //         "name": "Admin User",
    //         "email": "admin@example.com"
    //     },
    //     "expires": "2025-11-16T06:23:59.499Z"
    const handleLogout = async () => {
        'use server'
        await signOut()
    }
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="font-medium">
            {session.user?.name}
            {/* ユーザー情報が格納されてるsessionからユーザー名を表示 */}
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleLogout} className="cursor-point">
            ログアウト
        </DropdownMenuItem>
    </DropdownMenuContent>
    </DropdownMenu>

  )
}