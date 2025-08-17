/////////////////////////////////////////////////////////////////
////// (private)/layout.tsxに埋め込まれるヘッダーコンポーネント
/////////////////////////////////////////////////////////////////


import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Setting from './Setting' 
import { auth } from "@/auth"// auth.tsの{ auth, signIn, signOut, handlers }のauthから認証情報を取得できる。以下sessionに格納してる

export default async function PrivateHeader() {
    const session = await auth();
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
                </div>
            </header>
        </div>
    )
}