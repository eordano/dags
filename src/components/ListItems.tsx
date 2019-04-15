import React, { Component } from 'react';

import ItemDetail, { ItemDetailProps, ItemDetailActions } from './ItemDetail'
import { Item } from '../logic/Item';
import { Dropdown, DropdownProps } from 'decentraland-ui';

export default class ListItems extends Component<{ items: Item[] } & ItemDetailActions, { selected? : string }> {
  state = { selected: '' }
  updateItem = (ev: any, selected: DropdownProps) => this.setState({ selected: selected.value as string })
    render() {
      const mapNames: { [key: string]: string } = {}
      return <>
          <Dropdown
            placeholder='Select an item'
            fluid
            selection
            defaultValue={''}
            options={[ ...[{key: 'empty', text: 'Select an item', value: '' }], ...this.props.items.map((item: Item) => {
              return {
                key: item.id,
                text: item.name,
                value: item.id
              }
            })]}
            onChange={this.updateItem}
          />
        {
         this.props.items.filter(item => item.id === this.state.selected).map(item => {
            return <ItemDetail key={item.id} mapNames={mapNames} item={item} {...this.props} />
          })
        }
        </>
    }
}
