/////////////////////////////////////////////////////////////////
////// auth.config.tsでは主に認証ガード設定のようなことをしている
/////////////////////////////////////////////////////////////////


import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: { 
        signIn: '/login' // カスタムログインページを指定. デフォルトは/auth/signinだが、ここでは/loginページを使用
    },
    //////////////////////////////////////////////////////////////////////////////
    //////// 以下の関数はページアクセス時に毎回実行され、アクセス許可を判定する ////////
    //////////////////////////////////////////////////////////////////////////////
    callbacks: {    
        authorized({ auth, request: { nextUrl } }) { // auth - 現在のユーザーセッション情報、nextUrl - アクセスしようとしているURL
            const isLoggedIn = !!auth?.user; // ユーザーがログインしているか

            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') 
                || nextUrl.pathname.startsWith('/manage') // /dashboard/* と /manage/* のページはログインしていることが必須
                || nextUrl.pathname.startsWith('/chat') // セクション４のチャットフローAPIにあたって追加。'/chat/*'もログインしてないと見れない
            
            if (isOnDashboard) { // 「ダッシュボードにアクセスしようとしている場合」
                if (isLoggedIn) return true;  // 「さらにログインもしている場合」→ アクセス許可
                return Response.redirect(new URL('/login', nextUrl)); // `if (isLoggedIn)`がfalseの場合 →「ログインしていない場合」→/loginにリダイレクト
            } else if (isLoggedIn && nextUrl.pathname === '/login' ) { 
                return Response.redirect(new URL('/dashboard', nextUrl)); // ログイン済み → /login にアクセスした場合は /dashboard にリダイレクト
            }
            return true;
        },
    },
    providers: [], // ログインオプション。実際の認証プロバイダー（Google、GitHubなど）はauth/index.ts側で設定
} satisfies NextAuthConfig;

// satisfies NextAuthConfigは「この設定がNextAuthConfigの条件を満たしていることを確認しつつ、詳細な型情報も保持する」という意味