import React from 'react'
import AppContainer from './components/AppContainer'
import LoginController from './components/LoginController'
import MessageList from './components/MessageList'
import ErrorDisplay from './components/ErrorDisplay'

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: "unauthorized",  //unauthorized -> ready
            credentials: null
        }
    }

    isAuthorized() {
        return this.query.oauth_token && this.query.oauth_verifier
    }

    onLoginComplete(credentials) {
        this.setState({...this.state, state: "ready", credentials: credentials})
    }

    render() {
        return (
            <AppContainer>{this.getContent()}</AppContainer>
        )
    }

    getContent() {
        switch(this.state.state) {
            case "unauthorized":
                return <LoginController onLoginComplete={this.onLoginComplete.bind(this)}/>
            case "ready":
                return <MessageList credentials={this.state.credentials}/>
            case "error":
                return <ErrorDisplay error={this.state.error}/>
        }
    }
}