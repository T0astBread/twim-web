import React from 'react'
import ReactDOM from 'react-dom'
import InvalidResponseError from '../InvalidResponseError'
import ErrorDisplay from './ErrorDisplay'
import AppContainer from './AppContainer'

export default class LoginController extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: "awaitingUserAction", // unauthorized -> loadingRequestToken -> authorizing -> loadingAccessToken -> CALLS CALLBACK
            error: null
        }
    }

    render() {
        switch(this.state.state) {
            case "awaitingUserAction":
                return <button onClick={this.authorize.bind(this)}>Sign in using Twitter</button>
            case "loadingRequestToken":
            case "loadingAccessToken":
                return <span>Loading...</span>
            case "authorizing":
                return <span>Please authorize the app on the newly opened tab</span>
            case "authorized":
                return <span>You are authorized! Horray!</span>
            case "error":
                return <ErrorDisplay error={this.state.error}/>
        }
    }

    authorize() {
        if(this.state.state !== "awaitingUserAction") return
        this.setState({...this.state, state: "loadingRequestToken"})
        console.log("Loading OAuth request token")

        let authWindow = window.open()
        authWindow.document.title = "Loading..."
        ReactDOM.render((
            <AppContainer>
                <strong>Waiting for application to finish loading...</strong>
            </AppContainer>
        ), authWindow.document.body)

        window.addEventListener("message", message => {
            console.log("Recieved message from authWindow", message.data)
            if(message.data.successful === true) {
                this.onAuthorizationComplete(message.data)
            }
            else if(message.data.successful === false) {
                this.setState({...this.state, state: "error", error: {code: "AuthorizationDenied", message: "Oh, you don't wanna use this app? :<"}})
            }
        })

        let requestTokenRq = new XMLHttpRequest()
        requestTokenRq.open("GET", "http://local.t0ast.cc/authenticate/requestToken", true)
        requestTokenRq.onload = evt => {
            if(requestTokenRq.status === 200) {
                console.log("Recieved OAuth request token")
                this.setState({...this.state, state: "authorizing"})
                authWindow.location = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestTokenRq.responseText}`
            }
            else {
                let error = JSON.parse(requestTokenRq.responseText)
                console.error(error)
                this.setState({...this.state, state: "error", error: {code: error.errorCode, message: error.message}})
            }
        }
        requestTokenRq.send(null)
        this.setState({...this.state, state: "loadingRequestToken"})
    }

    onAuthorizationComplete(params) {
        this.loadAccessToken(params.oauth_token, params.oauth_verifier)
    }

    loadAccessToken(token, verifier) {
        let accessTokenRq = new XMLHttpRequest()
        accessTokenRq.open("GET", `http://local.t0ast.cc/authenticate/accessToken?verifier=${verifier}&token=${token}`)
        accessTokenRq.onload = evt => {
            let response = JSON.parse(accessTokenRq.responseText)
            if(accessTokenRq.status != 200) {
                console.error(`Server responded with a status of ${accessTokenRq.status}`, response)
                this.setState({...this.state, state: "error", error: response})
            }
            else if(!(response.token && response.secret)) {
                console.error(response)
                this.setState({...this.state, state: "error", error: new InvalidResponseError()})
            }
            else {
                console.log("Recieved OAuth access token")
                if(this.props.onLoginComplete) this.props.onLoginComplete(response)
            }
        }
        console.log("Requesting OAuth access token")
        accessTokenRq.send(null)
    }
}