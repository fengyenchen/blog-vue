import jwt from 'jsonwebtoken'

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set')
    }
    return process.env.JWT_SECRET
}

export const authenticate = (request, response, next) => {
    const authorization = request.get('authorization') // 從 request header 取得 Authorization
    const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : null

    if (!token) {
        return response.status(401).json({ message: '未提供登入憑證' })
    }

    try {
        const payload = jwt.verify(token, getJwtSecret())
        if (typeof payload === 'string' || !payload.sub || !payload.role) {
            return response.status(401).json({ message: '無效的登入憑證' })
        }

        request.auth = { userId: payload.sub, role: payload.role }
        next()
    } catch {
        return response.status(401).json({ message: '登入憑證無效或已過期' })
    }
}

export const requireRole = (...roles) => (request, response, next) => {
    if (!roles.includes(request.auth?.role)) {
        return response.status(403).json({ message: '權限不足' })
    }
    next()
}
