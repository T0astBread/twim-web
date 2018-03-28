import React from 'react'
import { parseQueryParams } from './utils'
import AppContainer from './components/AppContainer'

export default class AuthCallbackHandler extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isDelegate: window.opener != undefined
        }
        this.query = parseQueryParams()
    }

    render() {
        let content
        if(this.state.isDelegate) {
            this.handleAuthentication()
            content = <p>Please wait...</p>
        }
        else {
            content = (
                <div>
                    <h1>Seems like you got lost</h1>
                    <p>This page is opened automatically when needed, you don't have to deal with it!</p>
                </div>
            )
        }
        return <AppContainer>{content}</AppContainer>
    }

    handleAuthentication() {
        if(this.query.oauth_token && this.query.oauth_verifier) this.handleSuccessfulAuth()
        else this.handleFailedAuth()
        window.close()
    }

    handleSuccessfulAuth() {
        window.opener.postMessage(Object.assign({successful: true}, this.query), window.location.origin)
    }

    handleFailedAuth() {
        window.opener.postMessage({successful: false}, window.location.origin)
    }
}