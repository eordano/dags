import React, { Component } from 'react';

import { Segment, Field, HeaderMenu, Header, Button } from 'decentraland-ui'

function makeId(length: number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

export default class AddGroup extends Component<any, { name: string, color?: string, fill?: string }> {
    state = { name: '', color: undefined, fill: undefined }
    addGroup = () => {
      this.props.addGroup({ id: 'g' + makeId(6), ...this.state })
    }
    update = (ev: any) => {
      this.setState({ name: ev.target.value })
    }
    updateColor = (ev: any) => {
      this.setState({ color: ev.target.value })
    }
    updateFill = (ev: any) => {
      this.setState({ fill: ev.target.value })
    }
    render() {
      return <Segment>
            <HeaderMenu>
                <HeaderMenu.Left><Header>Add Group</Header></HeaderMenu.Left>
            </HeaderMenu>
            <Field label='Name' ref='name' onChange={this.update} />
            <Field label='Color' ref='color' onChange={this.updateColor} />
            <Field label='Fill' ref='fill' onChange={this.updateFill} />
            <Button primary onClick={this.addGroup}>Add</Button>
          </Segment>
    }
}
