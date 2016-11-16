import React from 'react'
import Nodes from './Nodes'

export default React.createClass({

	getInitialState() {
		return {
			data: require('json!./data.json'),
			width: 1000,
			height: 1000
		}
	},

	render() {
  	return (
			<div>
				<p>This is some container component</p>
				<Nodes data={ this.state.data } width={ this.state.width } height={ this.state.height } />
			</div>
    )
  }
})
