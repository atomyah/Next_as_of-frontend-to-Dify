/////////////////////////////////////////////////////////////////////////
////// ユーザー登録ページ（<RegisterForm />コンポーネントそのもの）
///// React19のuseActionStateを使ってログインフォームを作成している。
////  → メリット：preventDefault() や手動のsubmitハンドラーが不要。
/////  サーバーアクションlib/actions/createUser.tsをインポートしている。
///// フォーム送信時に自動的にサーバーアクションが呼び出される。
/////////////////////////////////////////////////////////////////////////

'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useActionState } from 'react'
import { createUser } from '@/lib/actions/createUser' // サーバーアクション（lib/actions/createUser.ts）

// useActionStateの挙動：
// １．初期表示: state = { success: false, errors: {} }
// ２．フォーム送信: formActionがcreateUserサーバーアクションを呼び出す
// ３．処理結果: createUserの戻り値が新しいstateになる（例：メアド重複の場合：{success: false, errors: {email: ["このメールアドレスはすでに登録されています"]}
/// handleValidationError()関数のreturn...が戻り値。成功の場合はhandleValidationError()を呼ばないので戻り値ない。
export default function RegisterForm() {
    const [state, formAction] = useActionState( // state: サーバーアクション関数からの戻り値。主にエラー情報をフォームに伝えるために使われる。
        createUser, {   // サーバーアクション関数(/lib/actions/createUser.ts で定義された関数)
        success: false, // 初期状態：未成功
        errors: {}      // 初期状態：エラーなし
    })
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input id="name" type="text" name="name" required />
                {state.errors.name && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.name.join(',')}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">メールアドレス</Label>
                <Input id="email" type="email" name="email" required />
                {state.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.email.join(',')}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input id="password" type="password" name="password" required />
                {state.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.password.join(',')}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">パスワード(確認)</Label>
                <Input id="confirmPassword" type="password" name="confirmPassword" required />
                {state.errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.confirmPassword.join(',')}</p>
                )}
            </div>
            <Button type="submit" className="w-full">登録</Button>
        </form>
      </CardContent>
    </Card>
  )
}
