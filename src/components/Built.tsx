import React, { Component } from 'react';

import { Segment } from 'decentraland-ui'

export default class Built extends Component<{ value: string }> {
    render() {
      return <Segment>
            <div className='ui form'>
              <textarea rows={5} value={this.props.value} readOnly={true} />
            </div>
          </Segment>
    }
}
