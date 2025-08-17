/////////////////////////////////////////////////////////////////////////
////// ログイン後ジャンプする/dashboardページ
/////////////////////////////////////////////////////////////////////////

import { auth } from '@/auth' // auth.tsの{ auth, signIn, signOut, handlers }のauthから認証情報を取得できる。以下sessionに格納してる
// import UserUsage from '@/components/UserUsage'

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id as string

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {/* <UserUsage userId={userId} /> */}
      </div>
    </div>
  )
}