import { NextRequest, NextResponse } from 'next/server';
// 環境変数の設定
const DIFY_API_KEY = process.env.DIFY_API_WORKFLOW_KEY
const endpoint = `${process.env.DIFY_API_URL}/workflows/run`

export async function POST(request: NextRequest){   // 関数名をPOSTにすると、Next.jsが自動的にPOSTリクエストを処理する
    
    try{
        const body = await request.json()  // requestでクエリ情報を引っ張ってくる
        const { query } = body  

        // DifyワークフローAPI接続
        const response = await fetch(endpoint, {    // DifyのAPIからフェッチ。Difyからの返答はresponseに
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DIFY_API_KEY}`
            },
            body: JSON.stringify({
                inputs: {
                    // 入力フィールドの変数名
                    query: query
                },
                response_mode: 'blocking',
                user: 'user-123'
            })
        })

        const data = await response.json()  // Difyからの返答はresponse
        console.log(data)

        const outputText = data.data.outputs.result // Difyからの返答はresponse JSONオブジェクトにdata.data.outputs.resultに回答文章が入ってる

        return NextResponse.json(outputText)


    } catch(error){
        console.error('APIエラー', error)
        return NextResponse.json('Dify側でエラーが発生しました')
    }

}
