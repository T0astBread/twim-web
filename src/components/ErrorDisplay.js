import React from 'react'

export default class ErrorDisplay extends React.Component {
    render() {
        return (
            <div>
                <h2>{this.props.error.code}</h2>
                <span>{this.props.error.message}</span>
            </div>
        )
    }
}