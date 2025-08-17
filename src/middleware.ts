/////////////////////////////////////////////////////////////
////// このミドルウェアはすべてのページアクセス前に実行され、
////// auth.config.tsのauthorized関数(callbacks)が呼び出される
/////////////////////////////////////////////////////////////


import NextAuth from 'next-auth';
import { authConfig } from './auth.config';


// NextAuth(authConfig) - auth.config.ts の設定を使用してNextAuthを初期化
// .auth - 認証ミドルウェア関数を取得
export default NextAuth(authConfig).auth;

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


////////////////////////////////////////////////
// ## matcher設定:
// この正規表現はミドルウェアを実行するパスを指定：
// ミドルウェア実行するページ例：
// / (ホームページ)
// /dashboard
// /login
// /about など

// 実行されないページ例：
// /api/* - API Routes
// /_next/static/* - 静的ファイル
// /_next/image/* - 最適化画像
// *.png - PNG画像ファイル