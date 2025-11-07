
/////////////////////////////////////////////////////////////////
////// ChatInput.tsxのcallDifyApi関数から呼び出されるAPIルートハンドラ
////// bodyの中にはqueryとuserIdが入っている→ body: JSON.stringify({query: input, userId: userId})
//////
////// セクション４-67にて、conversationIdの受け取りと、Dify API呼び出し部分の修正を追加
//////       → body: JSON.stringify({query: input, userId: userId, conversation_id: conversationId || ''})
//////
////// セクション4ー68にて、src/lib/conversation.tsファイルを作成、createConversation, updateConversation関数を呼び出す部分を追加
/////////////////////////////////////////////////////////////////

import { NextRequest, NextResponse } from 'next/server';
import { createConversation, updateConversation } from '@/lib/conversation';


// 環境変数の設定
const DIFY_API_KEY = process.env.DIFY_API_KEY
const endpoint = `${process.env.DIFY_API_URL}/chat-messages`



export async function POST(request: NextRequest){   // 関数名をPOSTにすると、Next.jsが自動的にPOSTリクエストを処理する
    
    try{
        const body = await request.json()  // requestでクエリ情報を引っ張ってくる
        const { query, userId, conversationId } = body  


        // ===============================
        // デバッグ：何が送られているか確認
        // ===============================
        console.log('■■■ デバッグ情報 ■■■')
        console.log('query:', query)
        console.log('userId:', userId)
        console.log('conversationId:', conversationId)  // ← ここが重要！
        console.log('conversationIdの型:', typeof conversationId)
        console.log('■■■■■■■■■■■■■■')




        // DifyチャットフローAPI接続
        const response = await fetch(endpoint, {    // DifyのAPIからフェッチ。Difyからの返答はresponseに
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DIFY_API_KEY}`
            },
            body: JSON.stringify({
                inputs: {},     //　ワークフローの場合と書き方違う。参考：api/workflow-block/route.tsの２０行目.
                // 開始ノードに入力値が複数ある時はinputs:{}にそれぞれの値を入れる.(ChatInputも参照のこと)
                    // inputs: { ↓ Difyの開始ノードの変数名に合わせる（重要！）
                    //     user_name: "太郎",      // 入力変数1
                    //     age: 25,                // 入力変数2
                    // },
                query: query,
                response_mode: 'blocking',
                user: userId,
                conversation_id: conversationId || '' // 左側がDifyから来るキー名で右側がChatInputから来るキー名.
                // 初回会話ではconversationIdは無いので|| nullしてる
            })
        })

        const data = await response.json()  // Difyからの返答はresponse

        if(!conversationId){    // 初回会話はconversationIdが無いので、新規作成するcreateConversation関数を呼び出す
            createConversation(data, userId, query) // queryはタイトルに使うためにconversation.tsに渡す.実態はDifyへの質問文章
        } else {                // 2回目以降の会話は既存のconversationIdを使って、会話履歴を更新するupdateConversation関数を呼び出す
            updateConversation(data, userId)
        }

        console.log('■api/chat/route.tsにてdata:', data)
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
