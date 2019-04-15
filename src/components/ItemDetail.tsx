import React, { Component } from 'react';

import { Segment, HeaderMenu, Header, Button, Dropdown, DropdownProps } from 'decentraland-ui'
import { Item } from '../logic/Item';
import { Edge } from '../logic/Edge';
import { Group } from '../logic/Group';

export type ItemDetailActions = { groups: any, edges: Edge[], updateItem: (item: Item) => any, deleteItem: (item: string) => any, deleteEdge: (from: string, to: string) => any }
export type ItemDetailProps = ItemDetailActions & { item: Item, mapNames: { [key: string]: string  } }
export default class ItemDetail extends Component<ItemDetailProps, { from: string, to: string }> {

    updateItem = (ev: any, ops: DropdownProps) => {
      this.props.updateItem({ ...this.props.item, group: ops.value as string })
    }
    setTo = (ev: any, opts: { value: string }) => {
      this.setState({ to: opts.value })
    }
    render() {
      const item = this.props.item
      const depends = this.props.edges.filter(edge => edge.to === item.id)
      const unlocks = this.props.edges.filter(edge => edge.from === item.id)
      return <Segment>
          <HeaderMenu>
              <HeaderMenu.Left><Header>{ item.name } <Button onClick={() => this.props.deleteItem(item.id)} basic>X</Button></Header></HeaderMenu.Left>
          </HeaderMenu>
          <Header>
          <Dropdown
            placeholder='Select a group'
            fluid
            selection
            defaultValue={item.group}
            options={this.props.groups.map((group: Group) => {
              return {
                key: group.id,
                text: group.name,
                value: group.id
              }
            })}
            onChange={this.updateItem}
          />
          </Header>
          {
            depends.length ?
              <>
              <Header sub>Unlocks</Header>
              { depends.map(edge => <Header key={`${edge.from}-${edge.to}`}>{this.props.mapNames[edge.from]} <Button basic onClick={() => this.props.deleteEdge(edge.from, edge.to)}>X</Button></Header>) }
              </>
              : <Header sub>Doesn't unlock tasks</Header>
          }
          {
            unlocks.length ?
              <>
              <Header sub>Depends on</Header>
              { unlocks.map(edge => <Header key={`${edge.from}-${edge.to}`}>{this.props.mapNames[edge.to]} <Button basic onClick={() => this.props.deleteEdge(edge.from, edge.to)}>X</Button></Header>) }
              </>
              : <Header sub>No dependencies</Header>
          }
        </Segment>
    }
}
