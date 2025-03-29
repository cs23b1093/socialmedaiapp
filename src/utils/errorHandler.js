class apiError extends Error {
    constructor(
        statusCode = 500,
        message= "Something went wrong",
        stack = "",
        errors = [],
    ){
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.sunccess = false
        this.data = null

        if(stack){
            this.stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}