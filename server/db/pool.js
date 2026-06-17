import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
}
export const pool = new Pool({
    connectionString: connectionString,
    // 如果是線上環境（非 localhost），就強制開啟 SSL 連線
    ssl: !connectionString.includes('localhost') 
        ? { rejectUnauthorized: false } 
        : false
})