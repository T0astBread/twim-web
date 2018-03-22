import React from 'react'
import ErrorDisplay from './ErrorDisplay'

const styles = {
    convList: {
        maxWidth: "800px",
        listStyle: "none",
        padding: 0,
        margin: "auto"
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0
    },
    message: {
        base: {
            root: {
                display: "flex",
                flexDirection: "row",
                lineHeight: "1rem",
                margin: "1em 0"
            },
            text: {
                display: "block",
                width: "max-content",
                height: "2rem",
                padding: "0 .75rem",
                margin: 0,
                verticalAlign: "middle",
                lineHeight: "2rem",
                borderRadius: "2rem",
                color: "white"
            },
            statusText: {
                display: "inline-block",
                width: "100%",
                padding: "0 .75rem"
            }
        },
        sent: {
            positioningHelper: {flexGrow: 1},
            text: {background: "#1da1f2"},
            statusText: {textAlign: "right"}
        },
        recieved: {
            positioningHelper: {flexGrow: 0},
            text: {background: "#141d26"},
            statusText: {textAlign: "auto"}
        }
    }
}

const getMessageStyle = message => styles.message[message.fromMe ? "sent" : "recieved"]

export default class MessageList extends React.Component {
    render() {
        if(this.state) {
            if(this.state.conversations) {
                let innerList = Object.keys(this.state.conversations).map(convPartner =>
                    <li>
                        <h2>Recent conversation with {convPartner}</h2>
                        <ul style={styles.list}>
                            {this.state.conversations[convPartner].map(message =>
                                <li style={styles.message.base.root}>
                                    <div className="message-positioning-helper" style={{...styles.message.base.positioningHelper, ...getMessageStyle(message).positioningHelper}}/>
                                    <div className="message-wrapper">
                                        <p style={{...styles.message.base.text, ...getMessageStyle(message).text}}>{message.text}</p>
                                        <small style={{...styles.message.base.statusText, ...getMessageStyle(message).statusText}}>{message.fromMe ? "Sent" : "Recieved"}</small>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </li>)
                return <ul style={styles.convList}>{innerList}</ul>
            }
            else if(this.state.errorCode) {
                return <ErrorDisplay errorCode={this.state.errorCode} message={this.state.message}/>
            }
        }
        else {
            this.load()
            return <p>Loading...</p>
        }
    }

    load() {
        let rq = new XMLHttpRequest()
        rq.open("GET", "http://local.t0ast.cc/list", true)
        rq.onload = evt => {
            let response = JSON.parse(rq.response)
            if(rq.status === 200) {
                this.setState({conversations: response})
            }
            else {
                this.setState(response) //{errorCode: "...", message: "..."}
            }
        }
        rq.send(null)
    }
}