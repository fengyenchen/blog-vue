import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
}

export const pool = new Pool({
    connectionString: connectionString,
    // 如果是線上環境（連線字串不含 localhost），就強制開啟 SSL 連線（Neon 必要設定）
    ssl: !connectionString.includes('localhost') 
        ? { rejectUnauthorized: false } 
        : false,
    // 針對 Serverless 環境的最佳化設定
    max: 10, // 限制單個實例的最大連線數
    idleTimeoutMillis: 30000, // 閒置連線釋放時間
    connectionTimeoutMillis: 5000, // 連線逾時
})