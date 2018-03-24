import React from 'react'
import ReactDOM from 'react-dom'
import ErrorDisplay from './ErrorDisplay'
import AppContainer from './AppContainer'

export default class LoginController extends React.Component {
    constructor(props) {
        super(props)
        this.state = {actionState: "awaitingUserAction", error: null}
    }

    render() {
        switch(this.state.actionState) {
            case "awaitingUserAction":
                return <button onClick={this.load.bind(this)}>Sign in using Twitter</button>
            case "loadingRequestToken":
                return <span>Loading...</span>
            case "authorizing":
                return (
                    <div>
                        <strong>Please authorize the app on the newly opened tab</strong>
                        <p>You can close this tab</p>
                    </div>
                )
            case "error":
                return <ErrorDisplay error={this.state.error}/>
        }
    }

    load() {
        if(this.state.actionState !== "awaitingUserAction") return
        this.setState({...this.state, state: "loadingRequestToken"})
        console.log("Loading OAuth request token")

        let authWindow = window.open()
        authWindow.document.title = "Loading..."
        ReactDOM.render((
            <AppContainer>
                <strong>Waiting for application to finish loading...</strong>
            </AppContainer>
        ), authWindow.document.body)

        let requestTokenRq = new XMLHttpRequest()
        requestTokenRq.open("GET", "http://local.t0ast.cc/authenticate/requestToken", true)
        requestTokenRq.onload = evt => {
            if(requestTokenRq.status === 200) {
                console.log("Recieved OAuth request token")
                this.setState({...this.state, actionState: "authorizing"})
                authWindow.location = `https://api.twitter.com/oauth/authenticate?oauth_token=${requestTokenRq.responseText}`
            }
            else {
                let error = JSON.parse(requestTokenRq.responseText)
                console.error(error)
                this.setState({...this.state, actionState: "error", error: {code: error.errorCode, message: error.message}})
            }
        }
        requestTokenRq.send(null)
        this.setState({...this.state, actionState: "loadingRequestToken"})
    }
}