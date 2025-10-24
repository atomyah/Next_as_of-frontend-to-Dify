/////////////////////////////////////////////////////////////////
////// (private)/layout.tsxに埋め込まれるヘッダーコンポーネント
////// また、ログアウト用ドロップダウンメニュー追加コンポーネントSetting.tsxを含む
/////////////////////////////////////////////////////////////////


import Link from 'next/link'
// ESLintエラーの解消のため以下のButtonとInputのimportをコメントアウト
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Setting from './Setting' 
import { auth } from "@/auth"// auth.tsの{ auth, signIn, signOut, handlers }のauthから認証情報を取得できる。以下sessionに格納してる

export default async function PrivateHeader() {
    const session = await auth(); // ログイン情報（ユーザー情報）をsessionに格納
    /// デバッグ用コード
    console.log('■PrivateHeader.tsxのsessionの中身：', 'Session:', JSON.stringify(session, null, 2));
    // 表示結果：(Claudeはidも含めるべきだとauth.config.tsのcallbacks:関数の変更を提示している)
    //  {
    //     "user": {
    //         "name": "Admin User",
    //         "email": "admin@example.com"
    //     },
    //     "expires": "2025-11-16T06:23:59.499Z"
     
    if(!session?.user?.email) throw new Error("不正なリクエストです")

    return (
        <div>
            <header className="border-b bg-blue-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link href="/dashborad" className="font-bold text-xl">
                                        管理ページ
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <Setting session={session} />
                    {/* sessionに格納されたユーザー情報をSettingコンポーネントに渡している */}
                </div>
            </header>
        </div>
    )
}