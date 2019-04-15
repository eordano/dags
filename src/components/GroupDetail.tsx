import React, { Component } from 'react';

import { Segment, HeaderMenu, Header, Button, Field } from 'decentraland-ui'
import { Group } from '../logic/Group';

export type GroupDetailDataAndActions = { deleteGroup: (g: string) => any, updateGroup: (g: Group) => any }
export type GroupDetailProps = GroupDetailDataAndActions & { group: Group }

export default class GroupDetail extends Component<GroupDetailProps> {
    state = {
      changed: false,
      name: '',
      fill: '',
      color: ''
    }
    update = () => {
      this.setState({
        changed: false
      })
      this.props.updateGroup({ ...this.props.group,
        name: this.state.name || this.props.group.name,
        fill: this.state.fill || this.props.group.fill,
        color: this.state.color || this.props.group.color
      })
    }
    updateName = (ev: any) => this.setState({ name: ev.target.value, changed: true })
    updateFill = (ev: any) => this.setState({ fill: ev.target.value, changed: true })
    updateColor = (ev: any) => this.setState({ color: ev.target.value, changed: true })
    render() {
      const group = this.props.group
      return <Segment>
          <HeaderMenu>
              <HeaderMenu.Left><Header>{ group.name } <Button onClick={() => this.props.deleteGroup(group.id)} basic>X</Button></Header></HeaderMenu.Left>
          </HeaderMenu>
          <>
            <Header sub>Color</Header>
            <Field label='Color' ref='color' value={this.state.color || group.color } onChange={this.updateColor} />
          </>
          <>
            <Header sub>Fill</Header>
            <Field label='Fill' ref='fill' value={this.state.fill || group.fill } onChange={this.updateFill} />
          </>
          <>
            <Header sub>Name</Header>
            <Field label='Name' ref='name' value={this.state.name || group.name } onChange={this.updateName} />
          </>
          <Button primary onClick={this.update} disabled={!this.state.changed}>Update</Button>
        </Segment>
    }
}
