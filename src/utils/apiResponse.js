class apiResponse{
    constructor(statusCode, message= 'Success!', data, error = null){
        this.statusCode = statusCode,
        this.message = message,
        this.data = data
        this.success = statusCode < 400
        this.error = error
    }
}

export { apiResponse }