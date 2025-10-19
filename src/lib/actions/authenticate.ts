/////////////////////////////////////////////////////////////////////////
/// このコードは Next.jsのサーバーアクション で、ユーザーのログイン認証を処理をする
// ログインフォームコンポーネント(LoginForm.tsx)から呼び出されユーザーが入力したメールアドレスとパスワードでの認証を試み、
// 認証が成功すればログイン状態になり、失敗すれば適切なエラーメッセージをユーザーに表示
// NextAuth.js（現在のAuth.js）を使った認証システムの一部として機能
/////////////////////////////////////////////////////////////////////////

'use server'; // サーバーアクションであることを示す

import { signIn } from '@/auth'; // signIn関数のインポート(auth.tsから引っ張ってきている)
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation'; // リダイレクト用の関数

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', {// signIn('credentials', formData)でユーザーのログイン情報（メールアドレスとパスワード）を検証
        ...Object.fromEntries(formData), // FormDataオブジェクトを通常のJavaScriptオブジェクトに変換し、スプレッド構文(...): オブジェクトのプロパティを展開。
        // これにより、formDataからemailとpasswordの値を取得できる（例: { email: "user@example.com", password: "password123" })
        redirect: false,    // 自動リダイレクトを無効化
    }) 
        redirect('/dashboard'); // ログイン成功時はダッシュボードにリダイレクト
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'メールアドレスまたはパスワードが正しくありません。';
                default:
                    return 'エラーが発生しました。';
            }
        } throw error; 
    }}