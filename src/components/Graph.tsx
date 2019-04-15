import React, { Component } from 'react';

import { Icon, HeaderMenu, Header, Button, Segment } from 'decentraland-ui'

type VizGlobal = NodeJS.Global & { Viz: any } 
declare const  global: VizGlobal
let Viz = global.Viz

export default class Graph extends Component<{ compiled: string }> {
    workerURL = 'full.render.js'
    viz: any

    constructor(props: any) {
        super(props)
        this.viz = new Viz({ workerURL: this.workerURL })
    }
    renderIt = (result: HTMLElement) => {
        var w = window.open("");
        w!.document.write(result.outerHTML);
    }
    download = () => {
        this.viz.renderImageElement(this.props.compiled)
            .then(this.renderIt)
            .catch((error: any) => {
                // Create a new Viz instance (@see Caveats page for more info)
                this.viz = new Viz({ workerURL: this.workerURL });
                // Possibly display the error
                console.error(error);
            });
    }
    render() {
      return <>
        <HeaderMenu>
            <HeaderMenu.Left><Header>Result</Header></HeaderMenu.Left>
            <HeaderMenu.Right><Button size="small" basic onClick={this.download}>Open Image &nbsp;<Icon name='external alternate'/></Button></HeaderMenu.Right>
        </HeaderMenu>
        <Segment className='two scroll'>
            <div id='graph' className='graph'/>
        </Segment>
      </>
    }
}
