/////////////////////////////////////////////////////////////////////////
////// (private)/chat/配下ページのレイアウト
////// ChatSidebarを埋め込み、propsでuserIdを渡している(セクション４－７５)
//////　ちなみにChatContainerはpage.tsxに埋め込まれている
////// ChatInputはChatContainerに埋め込まれている
/////////////////////////////////////////////////////////////////////////

import ChatSidebar from "@/components/ChatSidebar";
import { auth } from "@/auth";

export default async function PrivateLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    const userId = session?.user?.id as string
    // console.log('■(private)/chat/layout.tsxのsessionの中身：', session);
    // 出力結果：
    // {user: {
    //     email:"admin@example.com"
    //     id:"cmecev79800002lsxlj37zcya"
    //     name:"Admin User"
    //     }, 
    // expires: '2025-11-18T07:02:18.099Z'
    // }


    return (
        <div className="bg-slate-50 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden">
            <div className="w-full md:w-80 order-2 md:order-1 h-64 md:h-full border-t md:border-r md:border-t-0 bg-slate-100 overflow-y-auto">
                <ChatSidebar userId={userId} />
            </div>
            <div className="flex-1 p-4 order-1 md:order-2 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}