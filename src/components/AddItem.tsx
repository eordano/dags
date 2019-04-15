import React, { Component } from 'react';

import { Segment, Field, HeaderMenu, Header, Button } from 'decentraland-ui'

function makeId(length: number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default class AddItem extends Component<{ addItem: (opts: {name: string, id: string, group?: string}) => any }, { group?: string, value: string }> {
    state = { value: '', group: undefined }
    addItem = () => {
      this.props.addItem({ name: this.state.value, id: makeId(8), group: this.state.group })
    }
    update = (ev: any) => {
      this.setState({ value: ev.target.value })
    }
    render() {
      return <Segment>
            <HeaderMenu>
                <HeaderMenu.Left><Header>Add Item</Header></HeaderMenu.Left>
            </HeaderMenu>
            <Field label='Name' ref='name' onChange={this.update} />
            <Button primary onClick={this.addItem}>Add</Button>
          </Segment>
    }
}
