import { useState, useRef, useEffect } from 'react'


// EventSourceの型定義.anyだとエラーが出るのでunknownで対応
interface EventSourceType {
    event: string;
    workflow_run_id: string;
    task_id: string;
    data: {
        text?: string;
        node_type?: string;
        outputs?: {
            result?: string;
            [key: string]: unknown; // [key:string]: unknown, valueはunkown
        };
        [key: string]: unknown;  // [key:string]: unknown, valueはunkown
    };
    [key: string]: unknown;  // [key:string]: unknown, valueはunkown
}


export function useWorkflowStream(){
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const eventSourceRef = useRef<EventSource | null>(null) // 再レンダリング防止. SSEで多くの情報が流れてくるのでuseRefを使う
    const completeTextRef = useRef('') // 再レンダリング防止. SSEで多くの情報が流れてくるのでuseRefを使う

    // ストリーミングを開始
    const callDifyApi = () => {
        if (!input.trim()) return   // 入力が空の場合は何もしないという、よく使う手口
        setOutput("処理を開始しています...")

        setOutput('処理を開始しています…')

        completeTextRef.current = ''  // completeTextRefにはたくさんのチャンクが流れ込んでくる.既存のものを一旦リセット

        // 既存のSSE接続があれば一旦閉じてリセット
        if(eventSourceRef.current){
            eventSourceRef.current.close()
        }

        const url = `/api/workflow-stream?query=${input}&userId=user-123}` // ルートハンドラーのURL
        const eventSource = new EventSource(url) // SSEインスタンス化
        eventSourceRef.current = eventSource

        // チャンクが届くたびに発火
        eventSource.onmessage = (event) => {  
            try {
                const eventData = JSON.parse(event.data) // チャンクで届いたデータをJSONオブジェクトに変換
                handleEventData(eventData)  // チャンクで届いたデータから必要なテキストを取り出す
            } catch(error) {
                console.error('データ解析エラー', error, event.data)
            }
        }

        eventSource.onerror = (error) => { 
            console.error("イベント取得エラー:", error)
            eventSource.close()
        }
    }
    
    // イベントデータの内容で処理を変える. 引数にはEventSourceType型を指定（しないと上のhandleEventData(eventData)でエラー）
    const handleEventData = (eventData: EventSourceType) => { // eventDataはチャンクのこと
        // console.log('■イベント受信ーhandleEventData内のeventData.eventは：', eventData.event)

        // LLMがひとつの場合は'text_chunk'イベントが無数にある。
        if(eventData.event === 'text_chunk'){   // data:{"event":"text_chunk", "data":{"text":"チャンクのテキスト"}}
            appendText(eventData.data.text as string) // "data":{"text":"チャンクのテキスト"}のtextを取り出す
        }

        // LLMが二つ以上の場合は'text_chunk'イベントが無い。なのでイベントが'workflow_finished'の場合にresult（回答全文）をappendする
        // data: {"event": "workflow_finished", "data": {"outputs": {"result": "最終的な回答"}}}
        if(eventData.event === 'workflow_finished'){
            if (completeTextRef.current === "" || completeTextRef.current === "処理を開始しています...") {
                appendText(eventData.data.outputs?.result as string)
            }

            // チャンクが入ってる箱eventSourceRef.current(eventSource)を閉じる
            if (eventSourceRef.current) eventSourceRef.current.close();
        }
    } 

    //テキストを出力内容に追加(handleEventDataで呼び出す)
    const appendText = (text: string) => {
        if (!input.trim()) return   // 入力が空の場合は何もしない
        // 文章をoutputに設定
        completeTextRef.current += text;
        setOutput(completeTextRef.current)
    } 
    
    // 初回レンダリングでeventSourceRef.currentが残ってたらそれを閉じる
    useEffect(() => {
        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
        }, []); // 第2引数を [] とすると初回表示時のみ実行される



    // フックなので必ず戻り値をコンポーネント(ここではWorkflowStreaming.tsx)に返してあげる
    return { 
        input, 
        setInput, 
        output, 
        callDifyApi 
    }
}

