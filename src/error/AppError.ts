
// 1) https://github.com/microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work

interface AppErrorArgs{
    httpCode: number,
    message: string
}

export class AppError extends Error{
    httpCode: number
    constructor(args: AppErrorArgs){
        super(args.message)

        Object.setPrototypeOf(this, AppError.prototype) //1

        this.httpCode = args.httpCode
    }
}
