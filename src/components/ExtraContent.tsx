import React, { Component } from 'react';

import { Segment, HeaderMenu, Header } from 'decentraland-ui'

export default class ExtraContent extends Component<{ onChange: any, value: string }> {
    onChange = (ev: any) => {
        this.props.onChange(ev.target.value)
    }
    render() {
      return <Segment>
            <HeaderMenu>
                <HeaderMenu.Left><Header>Extra Content</Header></HeaderMenu.Left>
            </HeaderMenu>
            <Header>
            <div className='ui form'>
                <textarea onChange={this.onChange} value={ this.props.value }></textarea>
            </div>
            </Header>
          </Segment>
    }
}
