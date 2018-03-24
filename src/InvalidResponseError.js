export default class InvalidResponseError extends Error {
    constructor() {
        super()
        this.code = "InvalidResponseError",
        this.message = "The server gave an invalid response"
    }
}