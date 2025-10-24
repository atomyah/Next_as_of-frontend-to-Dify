/////////////////////////////////////////////////////////////////////////
////// 実際にユーザーがいるか、あるいはパスワードが合っているかのチェックコード
///// authenticate.tsからsignIn関数を呼び出される。ちなみにauthenticate.tsは
///// LoginForm.tsxのフォームから呼び出される
/////////////////////////////////////////////////////////////////////////

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
// Credentialsは、NextAuth が提供する「メール・パスワード認証」のプロバイダー.
// 他のプロバイダーの例: ↓
// import Google from 'next-auth/providers/google';
// import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from './lib/prisma'; 
import bcryptjs from 'bcryptjs';

async function getUser(email: string) { // PrismaのgetUser関数を呼び出し、ユーザー取得(メールアドレスでユーザーを検索)
    return await prisma.user.findUnique({
    where: { email: email }})
}


export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,

    // ESLintエラーの解消のため、trustHostを追加
    trustHost: true,
    
    providers: [
        // GoogleやGitHubサインインを行なう場合は以下のような設定を書く。
        // Google({ clientId: '...', clientSecret: '...' }),
        // GitHub({ clientId: '...', clientSecret: '...' }),
        Credentials({
            async authorize(credentials) {  // credentialにはユーザーがログインフォームで入力した情報がある。中身例：{ email: "user@example.com", password: "password123" }
            // メールアドレスとパスワードをZodで検証
            const parsedCredentials = z
            .object({ email: z.string().email(), password: z.string().min(8) })
            .safeParse(credentials);

            if (parsedCredentials.success) {    // メールアドレスとパスワードがバリデーションに成功した場合
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email); // PrismaのgetUser関数を呼び出し、ユーザー取得(メールアドレスでユーザーを検索)
                if (!user) return null;

                // password - ユーザーが入力した平文パスワード
                // user.password - データベースに保存されたハッシュ化パスワード                 
                const passwordsMatch = await bcryptjs.compare(password, user.password); 
                if (passwordsMatch) return user; // パスワードが一致した場合、ユーザーを返す
            }
                return null; // パスワードが一致しない場合、nullを返す
            }
        })
    ],
    // セッションにユーザーIDを含めるためのコールバック関数.ユーザIDはtoken.subに格納されている。
    callbacks: {
        async session({ session, token }) {
            // console.log('■auth.ts内session:', session)
            // console.log('■auth.ts内トークン:', token)    // tokenの中身をブラウザターミナルで確認できる。subという項目にユーザーIDが入っている。
            if (session.user) {
                session.user.id = token.sub as string // ユーザーID（token.sub）をセッションに追加
            }
            return session
        }
    }
});