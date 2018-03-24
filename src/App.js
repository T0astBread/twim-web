import React from 'react'
import { parseQueryParams } from './utils';
import InvalidResponseError from './InvalidResponseError'
import AppContainer from './components/AppContainer'
import LoginController from './components/LoginController'
import MessageList from './components/MessageList'
import ErrorDisplay from './components/ErrorDisplay'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: "unauthorized",  //unauthorized -> TAB CLOSED
                                    //             -> loadingAccessToken -> ready
            credentials: null
        }
        this.query = parseQueryParams()
        if(this.isAuthorized()) this.loadCredentials()
    }

    isAuthorized() {
        return this.query.oauth_token && this.query.oauth_verifier
    }

    loadCredentials() {
        let accessTokenRq = new XMLHttpRequest()
        accessTokenRq.open("GET", `http://local.t0ast.cc/authenticate/accessToken?verifier=${this.query.oauth_verifier}&token=${this.query.oauth_token}`)
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
                this.setState({...this.state, state: "ready", credentials: response})
            }
        }
        console.log("Requesting OAuth access token")
        accessTokenRq.send(null)
    }

    render() {
        return (
            <AppContainer>{this.getContent()}</AppContainer>
        )
    }

    getContent() {
        switch(this.state.state) {
            case "unauthorized":
            case "loggingIn":
                return <LoginController/>
            case "loadingAccessToken":
                return <strong>Loading...</strong>
            case "ready":
                return <MessageList credentials={this.state.credentials}/>
            case "error":
                return <ErrorDisplay error={this.state.error}/>
        }
    }
}