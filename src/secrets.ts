import dotenv from 'dotenv'

dotenv.config({path: '.env'})

export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.port; 
export const PAGE_SIZE = process.env.page_size; 
export const RATE_IMIT_WINDOW = process.env.rate_limit_window; 
export const RATE_LIMIT_MAX_REQUESTS = process.env.rate_limit_max_requests; 