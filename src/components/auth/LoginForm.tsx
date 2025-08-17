/////////////////////////////////////////////////////////////////////////
////// ログインページ（<LoginForm />コンポーネントそのもの）
///// React 19 の useActionState を使ってログインフォームを作成している
////  → メリット：preventDefault() や手動のsubmitハンドラーが不要。
/////////////////////////////////////////////////////////////////////////


'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useActionState } from 'react'
import { authenticate } from '@/lib/actions/authenticate' // サーバーアクション（lib/actions/authenticate.ts）

// useActionStateの挙動：
// １．isPending が true になる（ローディング開始）
// ２．formAction が authenticate サーバーアクションを呼び出す
// ３．フォームデータが自動的に authenticate の formData 引数に渡される（lib/actions/authenticate.tsに
//     await signIn('credentials', formData)のコードがある）
// authenticate の挙動：
// authenticate(prevState: string | undefined, formData: FormData,) {await signIn('credentials', formData); 
// // ↑ signIn('credentials', formData)でユーザーのログイン情報（メールアドレスとパスワード）を検証
export function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,   // サーバーアクション関数
        undefined,      // エラーメッセージの初期値
    );
    return ( 
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle>ログイン</CardTitle>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">メールアドレス</Label>
                    <Input id="email" type="email" name="email" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">パスワード</Label>
                    <Input id="password" type="password" name="password" required />
                </div>
                <Button type="submit" className="w-full">ログイン</Button>
                <div
                className="flex h-8 items-end space-x-1">
          {errorMessage && (
              <div className="text-red-500" >
                <p className="text-sm text-red-500">{errorMessage}</p>
            </div>
          )}
        </div>
            </form>
        </CardContent>
    </Card>
    )
}