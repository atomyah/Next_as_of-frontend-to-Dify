import { useState, useRef, useEffect } from 'react'

export function useWorkflowStream(){
    const [input, setInput] = useState('')
    const [output, setOutput] = useState('')
    const eventSourceRef = useRef<EventSource | null>(null) // 再レンダリング防止
    const completeTextRef = useRef('') // 再レンダリング防止

    // ストリーミングを開始
    const callDifyApi = () => {} 
    
    // イベントデータの内容で処理を変える
    const handleEventData = () => {} 
    
    // テキストを出力内容に追加
    const extractTextContent = () => {} // テキストを出力内容に追加

    //テキストを出力内容に追加
    const appendText = () => {} 
    
    // クリーンアップ(アンマウント時)
    useEffect(() => {}, [])

    return { 
        input, 
        setInput, 
        output, 
        callDifyApi 
    }
}

