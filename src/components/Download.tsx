import React, { Component } from 'react';

import { Segment, HeaderMenu, Header, Button } from 'decentraland-ui'

function downloadFile(filename: string, text: string) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export default class Download extends Component<{ getData: any }> {
    render() {
      return <Segment>
            <HeaderMenu>
                <HeaderMenu.Left><Header>Download</Header></HeaderMenu.Left>
            </HeaderMenu>
            <Button primary onClick={() => downloadFile('graph.json', this.props.getData())}>Download</Button>
          </Segment>
    }
}
