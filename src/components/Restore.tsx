import React, { Component } from 'react';

import { Segment, HeaderMenu, Header } from 'decentraland-ui'

export default class Restore extends Component<{ onData: (_: any) => any }> {
    state = { data: '' }
    restore = () => {
      console.log(this.refs.filefield)
    }
    update = (value: any) => {
      const file = value.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string)
          if (data.items === undefined || data.edges === undefined || data.extra === undefined) {
            throw new Error()
          }
          this.props.onData(data)
        } catch (e) {
          alert('File did not contain a valid JSON')
        }
      }
      reader.readAsText(file)
    }
    render() {
      return <div>
              <input type='file' onChange={this.update} name='restore' id='restore' className='inputfile' />
              <label className='ui button primary' htmlFor='restore'>Upload a .json file</label>
            </div>
    }
}
