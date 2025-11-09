
/////////////////////////////////////////////////////////////////
////// ChatInput.tsxのcallDifyApi関数から呼び出されるAPIルートハンドラ
////// bodyの中にはqueryとuserIdが入っている→ body: JSON.stringify({query: input, userId: userId})
//////
////// セクション４-６７にて、conversationIdの受け取りと、Dify API呼び出し部分の修正を追加
//////       → body: JSON.stringify({query: input, userId: userId, conversation_id: conversationId || ''})
//////
////// セクション４ー６８にて、src/lib/conversation.tsファイルを作成、createConversation, updateConversation関数を呼び出す部分を追加
//////
////// セクション４－７５にて「会話リスト（会話(conversations)）をDifyから取得するコードに変更
////// Dify APIエンドポイントhttp://localhost/v1/conversations からGETでfetch。
////// ChatSidebarコンポーネントからawait fetch(`/api/conversations?userId=${userId}`)で呼び出される。
/////////////////////////////////////////////////////////////////

import { NextRequest, NextResponse } from 'next/server';
// 環境変数の設定
const DIFY_API_KEY = process.env.DIFY_API_KEY
// 会話（conversations)は現在のユーザー（user）の会話リストを取得する。あくまで会話リストなので会話の内容（answer）は含まない
const endpoint = `${process.env.DIFY_API_URL}/conversations`    // http://localhost/v1/conversations


export async function GET(request: NextRequest){   
    
    try{
        // api/workflow-streaming/route.tsからコピーしてきた。'query'を'userId'に変更
        const searchParams = request.nextUrl.searchParams;  
        const userId = searchParams.get('userId');    // キーがuserIdのパラメータを取得


        // ===============================
        // デバッグ：何が送られているか確認
        // ===============================
        console.log('■■■ api/conversations/route.ts,デバッグ情報 ■■■')
        console.log('query:', 'なし')
        console.log('userId:', userId)
        console.log('conversationId:', 'なし') 
        console.log('conversationIdの型:', 'なし')
        console.log('■■■■■■■■■■■■■■')


        // DifyチャットフローAPI接続
        // ${endpoint}は http://localhost/v1/conversations → １８行目参照
        const response = await fetch(`${endpoint}?user=${userId}&limit=50`, {    // DifyのAPIからフェッチ。Difyからの返りはresponseに
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DIFY_API_KEY}`
            },
        })

        const data = await response.json()  // Difyからの返りはresponse


        console.log('■api/conversations/route.tsにてdata:', data)
        // 出力結果：
        // ■api/chat/route.tsにてdata: {
        // event: 'message',
        // task_id: '46ff3081-33f0-4c88-ad33-c16f797aa442',
        // id: '17a568ca-74a5-43c7-b953-266f5045cc87',
        // message_id: '17a568ca-74a5-43c7-b953-266f5045cc87',
        // conversation_id: '8d83d82b-24c8-4519-b557-d8ac161f263f',
        // mode: 'advanced-chat',
        // answer: 'テストありがとうございます！何かお手伝いできることがあれば教えてください。',
        // metadata: {
        //     usage: {
        //     prompt_tokens: 32,
        //     ・・・
        //    }
        // },
        // created_at: 1761288098
        // }

        
        // 以下はワークフローの場合
        //const outputText = data.data.outputs.result // Difyからの返答はresponse JSONオブジェクトにdata.data.outputs.resultに回答文章が入ってる

        return NextResponse.json(data)


    } catch(error){
        console.error('APIエラー', error)
        return NextResponse.json('Dify側でエラーが発生しました')
    }

}
