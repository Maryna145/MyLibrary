import {
    FORBIDDEN,
    NOT_FOUND,
    SERVER_ERROR,
    UNAUTHORIZED,
    VALIDATION_ERROR,
} from '../constants.js'

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }

    const statusCode = res.statusCode ? res.statusCode : SERVER_ERROR

    res.status(statusCode)

    const isProduction = process.env.NODE_ENV === 'production'
    const stackTrace = isProduction ? null : err.stack

    switch (statusCode) {
        case VALIDATION_ERROR:
            res.json({ title: "Validation Failed", message: err.message, stackTrace })
            break
        case UNAUTHORIZED:
            res.json({ title: "Unauthorized", message: err.message, stackTrace })
            break
        case FORBIDDEN:
            res.json({ title: "Forbidden", message: err.message, stackTrace })
            break
        case NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace })
            break
        case SERVER_ERROR:
        default:
            res.json({ title: "Server Error", message: err.message, stackTrace })
            break
    }
}

export { errorHandler }
