const asyncHandler = (fn) => async (req, res, next) => {

    try {
        await fn(req, res, next).catch((error) => {
            console.error("error occured while requesting the function!", error)
        });
    } catch (error) {
        res.status(error.code || 500).json({
            message: error.message ,
            success: false
        })
    }
}

export { asyncHandler }
