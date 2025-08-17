/////////////////////////////////////////////////////////////////////////
////// 実際にユーザーがいるか、あるいはパスワードが合っているかのチェックコード
/////////////////////////////////////////////////////////////////////////

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
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
    providers: [
        Credentials({
            async authorize(credentials) {
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
});