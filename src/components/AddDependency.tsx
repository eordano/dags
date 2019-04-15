import React, { Component } from 'react';

import { Segment, HeaderMenu, Header, Button, Dropdown, DropdownProps } from 'decentraland-ui'
import { Item } from '../logic/Item';

export default class AddDependency extends Component<{
  addDependency: any,
  items: Item[]
}, {  
  from: string,
  to: string
}> {
    state = { from: '', to: '' }
    setFrom = (ev: any, opts: DropdownProps ) =>{
      this.setState({ from: opts.value as string })
    }

    setTo = (ev: any, opts: DropdownProps) => {
      this.setState({ to: opts.value as string })
    }

    send = () => this.props.addDependency(this.state)
    render() {
      return <Segment>
            <HeaderMenu>
                <HeaderMenu.Left><Header>Add Dependency</Header></HeaderMenu.Left>
            </HeaderMenu>
            <Header>
              <Dropdown
                placeholder='From'
                fluid
                selection
                options={this.props.items.map(item => {
                  return {
                    key: item.id,
                    text: item.name,
                    value: item.id
                  }
                })}
                onChange={this.setFrom}
              />
            </Header>
            <Header>
              <Header>depends on</Header>
            </Header>
            <Header>
              <Dropdown
                placeholder='To'
                fluid
                selection
                options={this.props.items.map(item => {
                  return {
                    key: item.id,
                    text: item.name,
                    value: item.id
                  }
                })}
                onChange={this.setTo}
              />
            </Header>
            <Button primary onClick={this.send} disabled={!(this.state.from && this.state.to)}>Add</Button>
          </Segment>
    }
}
