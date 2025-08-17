/////////////////////////////////////////////////////////////////////////
////// Prismaにダミーデータを作るコード
/////////////////////////////////////////////////////////////////////////


// primsa.対象テーブル名.メソッド のように記述
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient() // PrismaClientのインスタンスを作成（ダミーデータ作成時だけ使う）

async function main() {
    await prisma.user.deleteMany() // ユーザーテーブルのデータを全て削除
    const hashedPassword = await bcrypt.hash('password123', 12) // 暗号化


    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@example.com',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN'
    }})
    const user = await prisma.user.create({
        data: {
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
            role: 'USER'
    }})

    console.log('■seed.ts内{ adminUser, user }を表示：',{ adminUser, user })

    const allUsers = await prisma.user.findMany(); //findMany()はテーブルの全レコードを取得

    console.log('■seed.ts内allUsersを表示:', allUsers);
}


    main().catch((e) => { 
        console.error(e) 
        process.exit(1) 
    })
    .finally(async () => { 
        await prisma.$disconnect() 
    })

