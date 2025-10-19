/////////////////////////////////////////////////////////////////////////
////// ユーザー登録（サーバーアクション）
////// ユーザー登録コンポーネント（components/auth/RegisterForm.tsx）で呼ばれる
////// バリデーション、重複確認、DB登録、登録後の自動ログイン処理を行う
////// src/validations/user.tsで定義されたregisterSchemaバリデーションオブジェクトをインポートしてる
/////////////////////////////////////////////////////////////////////////

'use server'; 

import { registerSchema } from "@/validations/user"; // src/validations/user.tsに定義したZodバリデーションregisterSchemaをインポート
import { prisma } from "@/lib/prisma"
import bcryptjs from "bcryptjs";
import { signIn } from "@/auth"; // signIn関数のインポート(auth.tsから引っ張ってきている)
import { redirect } from "next/navigation";
import { ZodError } from 'zod'

type ActionState = {
    success: boolean,
    errors: Record<string, string[]> // name, email, password, confirmPassword などのフィールド名をキーに、エラーメッセージの配列を値とするオブジェクト
    // 例: { name: ["名前は必須です"], email: ["メールアドレスは必須です"] }。ひとつずつ書くのは面倒なのでRecord<string, string[]>でまとめてしまっている。
}


// バリデーションエラー処理
function handleValidationError(error: ZodError): ActionState {  // Promise<ActionState>で必ずActionStateを返す約束（Promise）のため戻り値の型は必ずActionState
    const { fieldErrors, formErrors } = error.flatten();
    const castedFieldErrors = fieldErrors as Record<string, string[]>
    // zodの仕様でパスワード一致確認のエラーだけは formErrorsで渡ってくる（そのほかはfieldErrorsで渡ってくる）
    // formErrorsがある場合は、confirmPasswordフィールドにエラーを追加
    if (formErrors.length > 0) {
      return { success: false, errors: { ...fieldErrors, confirmPassword: formErrors
        }}}
    return { success: false, errors: castedFieldErrors };
  }
  
  // カスタムエラー処理
  // Record はTypeScriptの組み込みのユーティリティ型.「フォームの各フィールド名（キー）が文字列で、その値も文字列」ということを示す
  function handleError(customErrors: Record<string, string[]>): ActionState { // Promise<ActionState>で必ずActionStateを返す約束（Promise）のため戻り値の型は必ずActionState
    return { success: false, errors: customErrors };
  }



export async function createUser(
    // Server Actionの関数シグネチャで、useActionStateフックと連携するための型定義
    prevState: ActionState, // 前回の状態: 前回のServer Action実行結果
    formData: FormData      // フォームデータ: ユーザー登録フォームから送信されたデータ
    ): Promise<ActionState> // 戻り値: 非同期でActionStateを返し、この戻り値が次回のprevStateになる
                            // Promise:非同期処理の結果を表す型. async function は必ず Promise を返す.
                            // 「この関数は非同期で実行され、完了時にActionState形式のデータを返しますよ」という約束
{
    // フォームから渡ってきた情報を取得（rawFormData.name, rawFormData.emailといった形で取得できるようになる）
    const rawFormData = Object.fromEntries( // 4つの値を取得
        ["name", "email", "password", "confirmPassword"].map((field) => [
        field,
        formData.get(field) as string,
    ])
    ) as Record<string, string>;
    // Record はTypeScriptの組み込みのユーティリティ型.「フォームの各フィールド名（キー）が文字列で、その値も文字列」ということを示す

    // バリデーション
    const validationResult = registerSchema.safeParse(rawFormData) 
    //rawFormData:フォームから渡ってきた情報。safeParse: src/validation/user.tsに定義したZodバリデーションを実行
        // .parse() - バリデーション（エラー時は例外を投げる）
        // .safeParse() - 安全なバリデーション（エラー時はオブジェクトで返す）
    if(!validationResult.success){
        return handleValidationError(validationResult.error)
    }

    // DBにメールアドレスが存在しているかの確認
    const existingUser = await prisma.user.findUnique({
        where: { email: rawFormData.email }
    })
    if (existingUser) {
        return handleError({
            email: ["このメールアドレスはすでに登録されています。"]
        })
    }

    // DBに登録（UserとSubscriptionを同時に作成）
    const hashedPassword = await bcryptjs.hash(rawFormData.password, 12) // 暗号化

    await prisma.user.create({
        data: {
            name: rawFormData.name,
            email: rawFormData.email,
            password: hashedPassword,
        }
    })

    // dashboardにリダイレクト(lib/actions/authenticate.tsのsignIn関数と同じ)
       await signIn('credentials', {// signIn('credentials', formData)でユーザーのログイン情報（メールアドレスとパスワード）を検証
        ...Object.fromEntries(formData), // FormDataオブジェクトを通常のJavaScriptオブジェクトに変換し、スプレッド構文(...): オブジェクトのプロパティを展開。
        // これにより、formDataからemailとpasswordの値を取得できる(例: { email: "user@example.com", password: "password123" })
        redirect: false,    // 自動リダイレクトを無効化
    })
    redirect('/dashboard'); // ログイン成功時はダッシュボードにリダイレクト
}