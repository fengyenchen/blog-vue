-- 啟用 UUID 擴充功能
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 建立 users 資料表
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user'::text,
);

-- 建立 posts 資料表
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image TEXT,
    status TEXT NOT NULL DEFAULT 'draft'::text,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- 宣告外鍵約束，指向 users 表的 id 欄位
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) 
        REFERENCES public.users (id) 
        ON DELETE CASCADE
);

-- 建立 editor_applications 資料表
CREATE TABLE public.editor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    remark TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 建立外鍵約束，確保 user_id 存在於 users 資料表中
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES public.users(id)
        ON DELETE CASCADE
);