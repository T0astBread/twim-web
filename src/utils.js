export const parseQueryParams = () => {
    let params = {}
    window.location.search.substr(1).split("&").forEach(param => {
        let parts = param.split("=")
        params[parts[0]] = parts[1]
    })
    return params
}