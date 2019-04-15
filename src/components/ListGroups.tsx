import React, { Component } from 'react';

import GroupDetail, { GroupDetailProps, GroupDetailDataAndActions } from './GroupDetail'
import { Group } from '../logic/Group';

export default class ListGroups extends Component<{ groups: Group[] } & GroupDetailDataAndActions> {

    render() {
      return <>
          {
            this.props.groups.map(group => {
              return <GroupDetail key={group.id} group={group} {...this.props} />
            })
          }
        </>
    }
}
