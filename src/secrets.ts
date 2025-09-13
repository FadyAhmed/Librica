import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.port; 
export const PAGE_SIZE = process.env.page_size; 