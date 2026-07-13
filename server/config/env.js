import dotenv from 'dotenv'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const configDirectory = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(configDirectory, '..', '.env') })
