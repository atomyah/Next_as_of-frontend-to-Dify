
/////////////////////////////////////////////////////////////////
////// api/chat/route.tsの関数createConversation(data, userId, query)とupdateConversation(data, userId)を
////// 定義しているだけ。Prismaデータベースを新規作成／更新する関数
////// なぜか、DBの中身はconversation_id, userId, totalTokens, totalCostのみ…？？？
/////////////////////////////////////////////////////////////////

import { prisma } from "@/lib/prisma"

// DifyのAPIレスポンス型定義
export type ChatFlowType = {
    conversation_id: string;
    metadata: {
        usage: {
            total_tokens: number;
            total_price: string;
            [key: string]: unknown; /// 
        }
    },
    [key: string]: unknown;
    // [key: string]: unknown; はインデックスシグネチャといって「定義していない他のプロパティも受け入れる」という意味
    // なぜ使うの?  →    DifyのAPIレスポンスはが将来変わる可能性がある
}


export async function createConversation(data: ChatFlowType, userId: string, query: string) {// タイトルはquery(文章)の最初の部分を使うことにする
    await prisma.conversation.create({
        data: {
            difyConversationId: data.conversation_id,
            userId: userId,
            title: query.substring(0, 30) + "...", // 仮のタイトル
            totalTokens: data.metadata.usage.total_tokens,
            totalCost: parseFloat(data.metadata.usage.total_price) // totalCostはPrisma.schemaでFloat型
        }
    })
} 

export async function updateConversation(data: ChatFlowType, userId: string) {
    await prisma.conversation.update({
        where: {
            userId: userId,                             // Prismaで@@unique([difyConversationId, userId])複合キーなので、
            difyConversationId: data.conversation_id    // userIdとdifyConversationIdの両方で特定する必要がある
        },
        data: {
            totalTokens: data.metadata?.usage?.total_tokens,
            totalCost: parseFloat(data.metadata?.usage?.total_price) // totalCostはPrisma.schemaでFloat型
        }
    })
}