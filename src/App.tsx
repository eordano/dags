import React, { Component } from 'react';

import { Hero, Logo, Page, Container } from 'decentraland-ui';

import 'decentraland-ui/lib/styles.css';
import './App.css';

import Download from './components/Download'
import Restore from './components/Restore'
import AddItem from './components/AddItem'
import AddDependency from './components/AddDependency'
import AddGroup from './components/AddGroup'
import ExtraContent from './components/ExtraContent'
import Graph from './components/Graph'
import ListItems from './components/ListItems'
import ListGroups from './components/ListGroups'
import Built from './components/Built'

import EventEmitter from 'events'
import { Item } from './logic/Item';
import { Edge } from './logic/Edge';
import { Group } from './logic/Group';

type VizGlobal = NodeJS.Global & { Viz: any } 
declare const  global: VizGlobal

const BACKUP = true
let Viz = global.Viz

function makeId(length: number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
}

function getNewId() {
    return makeId(8);
}

interface Configuration {
    items: Item[]
    edges: Edge[]
    groups: Group[]
    config: { [key: string]: string }
    extra: string
    compiled?: string
}

type OptionalConfiguration = Partial<Configuration>

class Controller extends EventEmitter implements Configuration {
    items: Item[] = []
    edges: Edge[] = []
    groups: Group[] = []
    groupMap: { [key: string]: string } = { /* node id -> group id */ }
    groupSet: { [key: string]: Item[] } = { /* group id -> node array */ }
    config: { [key: string]: string } = {}
    extra = ''

    cache = {
        items: '',
        edges: '',
        groups: '',
        config: '',
        extra: ''
    }

    compiled = 'digraph G {  }'

    renderItem(item: Item) {
        return `"${item.id}" [shape=${item.shape || 'box'}${ item.fill ? ',style=filled,fillcolor=' + item.fill : '' }${ item.color ? ',color=' + item.color : '' },label="${item.name}"];`
    }

    updateGroupMap() {
        this.groupMap = {}
        this.groupSet = {}
        this.items.filter(item => !!item.group).map(item => this.groupMap[item.id] = item.group!)
        this.items.filter(item => !!item.group).forEach(item => {
            this.groupSet[item.group!] = this.groupSet[item.group!] || []
            this.groupSet[item.group!].push(item)
        })
    }

    renderGroup(group: Group) {
        if (!this.groupSet[group.id]) return
        const style = group.fill ? `style="filled";\ncolor="${group.fill}";\n` : '';
        const label = `label="${group.name}";\n`;
        const nodes = this.groupSet[group.id].map(item => this.renderItem(item)).join('\n')
        return `subgraph cluster_${group.id} {\n${style} ${nodes} ${label} }\n`
    }

    update(elements: OptionalConfiguration) {
        let changed = false
        if (elements.groups !== undefined && this.groups !== elements.groups) {
            this.groups = elements.groups
            changed = true
        }
        if (elements.items !== undefined && this.items !== elements.items) {
            this.items = elements.items
            changed = true
        }
        if (changed) {
            this.updateGroupMap()
            this.cache.groups = this.groups.map(group => this.renderGroup(group)).join('\n')
            this.cache.items = this.items.filter(item => !this.groupMap[item.id]).map(i => this.renderItem(i)).join('\n')
            this.cache.edges = this.edges.map(i => `"${i.to}" -> "${i.from}";`).join('\n')
        }
        if (elements.edges !== undefined && this.edges !== elements.edges) {
            this.edges = elements.edges
            this.cache.edges = this.edges.map(i => `"${i.to}" -> "${i.from}";`).join('\n')
            changed = true
        }
        if (elements.config !== undefined && this.config !== elements.config) {
            this.config = elements.config
            this.cache.config = Object.keys(elements.config).map(key => `${key}="${elements.config![key]}";`).join('\n')
            changed = true
        }
        if (elements.groups !== undefined && this.groups !== elements.groups) {
            this.groups = elements.groups
            this.cache.groups = ''
            changed = true
        }
        if (elements.extra !== undefined && this.extra !== elements.extra) {
            this.extra = elements.extra
            this.cache.extra = elements.extra
            changed = true
        }
        if (changed) {
            this.compiled = `digraph G {\n${this.cache.config}\n${this.cache.groups}\n${this.cache.items}\n${this.cache.edges}\n${this.cache.extra}\n}`
            this.emit('changed', { items: this.items, groups: this.groups, config: this.config, extra: this.extra, edges: this.edges, compiled: this.compiled })
            this.emit('compiled', this.compiled)
        }
    }
}

class App extends Component<any, Configuration> {
    controller: Controller

    constructor(props?: any, arg?: any) {
        super(props, arg)
        this.controller = new Controller()
        this.state = {
            items: [],
            edges: [],
            groups: [],
            config: {},
            extra: '',
            compiled: this.controller.compiled
        }
        const workerURL = 'full.render.js'
        let viz = new Viz({ workerURL });

        const renderIt = (element: HTMLElement) => {
            const graph = document.getElementById('graph');
            if (graph) {
              graph.innerHTML = ''
              graph.appendChild(element)
            }
        }

        this.controller.on('compiled', (content) => {
            viz.renderSVGElement(content)
                .then(renderIt)
                .catch((error: any) => {
                    // Create a new Viz instance (@see Caveats page for more info)
                    viz = new Viz({ workerURL });
                    // Possibly display the error
                    console.error(error);
                });
        })

        if (BACKUP) {
            this.controller.on('changed', (compiled) => {
                localStorage.setItem('backup', JSON.stringify(compiled))
            })
            const backup = localStorage.getItem('backup')
            if (backup) {
                const data = JSON.parse(backup)
                this.state = data
                this.controller.update(data)
            }
        }
    }
    componentWillMount() {
        this.controller.on('changed', compiled => this.setState(compiled))
    }
    update = (data: OptionalConfiguration) => this.controller.update(data)
    getDownload = () => {
        const data = { ...this.state }
        delete data.compiled
        return JSON.stringify(data, null, 2)
    }
    loadData = (data: OptionalConfiguration) => {
        this.update(data)
    }
    addItem = (item: Item) => {
        this.update({
            items: [...this.state.items, item]
        })
    }
    addDependency = ({ from, to }: Edge) => {
        this.update({
            edges: [...this.state.edges, { from, to }]
        })
    }
    addGroup = (group: Group) => {
        this.update({
            groups: [...this.state.groups, group]
        })
    }
    updateGroup = (group: Group) => {
        this.update({
            groups: [...this.state.groups.filter(g => g.id !== group.id), group]
        })
    }
    updateItem = (item: Item) => {
        this.update({
            items: [...this.state.items.filter(i => i.id !== item.id), item]
        })
    }
    deleteGroup = (group: string) => {
        this.update({
            groups: this.state.groups.filter(g => g.id !== group),
            items: this.state.items.map(n => n.group === group ? { ...n, group: undefined } : n)
        })
    }
    updateExtra = (extra: string) => {
        this.update({ extra })
    }
    deleteItem = (id: string) => {
        this.update({
            edges: this.state.edges.filter((edge) => edge.from !== id && edge.to !== id),
            items: this.state.items.filter((node) => node.id !== id)
        })
    }
    deleteEdge = (from: string, to: string) => {
        this.update({
            edges: this.state.edges.filter((edge) => edge.from !== from || edge.to !== to)
        })
    }
    updateGraph = () => ({})

    render() {
      return (<Page>
        <Container>
        <div className='ui grid full height'>
          <div className='one wide column'>
          </div>
          <div className='three wide column'>
            <Download getData={this.getDownload} />
            <Restore onData={this.loadData} />
            <AddItem addItem={this.addItem} />
            <AddGroup addGroup={this.addGroup} />
            <AddDependency items={this.state.items} addDependency={this.addDependency} />
            <ListGroups groups={this.state.groups} updateGroup={this.updateGroup} deleteGroup={this.deleteGroup} />
            <ExtraContent value={this.state.extra} onChange={this.updateExtra} />
          </div>
          <div className='three wide column'>
            <ListItems items={this.state.items} edges={this.state.edges} groups={this.state.groups} updateItem={this.updateItem} deleteItem={this.deleteItem} deleteEdge={this.deleteEdge} />
          </div>
          <div className='eight wide column' ref='graph'>
            <Graph compiled={this.state.compiled!} />
          </div>
          <div className='one wide column'/>
          <div className='one wide column'/>
          <div className='fourteen wide column'>
            <Built value={this.state.compiled!} />
          </div>
        </div>
        </Container>
        </Page>
      );
    }
}

export default App;
