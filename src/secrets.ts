import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const PORT = process.env.port; 
export const JWT_SECRET = process.env.JWT_SECRET!; 