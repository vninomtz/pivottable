import Node from "./node"
import {getKeyValues} from "./utils"

interface PivotParams {
  data: Array<Object>
  rows: Array<string>
  columns: Array<String>
}

function appendNodes(_node: Node, _keys: Array<string>, record: Object){
  let keys = [..._keys]
  let node = _node
  let key = keys.shift()
  // add record to root to handle global agg
  node.records.push(record)

  while (key !== undefined) {
    let n = node.findNodeByValue(key)
    if (n === undefined) {
      n = new Node()
      n.parent = node
      n.value = key
      node.nodes.push(n)
    }
    n.records.push(record)
    node = n
    key = keys.shift()
  }
}

export function height(node: Node): number {
  if (node.nodes.length === 0) {
    return 0
  }
  return 1 + node.nodes.reduce((acc, n) => {
    return Math.max(acc, height(n))
  }, 0)
}

export interface ItemNode {
  index: number
  node: Node
  depth: number
}

export function flatTree(root: Node, arr: Array<ItemNode>, depth: number) {

  const item: ItemNode = {
    index: arr.length,
    node: root,
    depth
  }
  arr.push(item)

  root.nodes.forEach(n => {
    flatTree(n, arr, depth + 1)
  })
}

export default class PivotData {
  rows: Node
  
  constructor(rootRows: Node) {
    this.rows = rootRows
  }

  static pivot (params: PivotParams) {
    const {data, rows} = params

    const root = new Node()

    data.forEach(record => {
      const rowValues = getKeyValues(record, rows)
      appendNodes(root, rowValues, record)
    })

    return new PivotData(root)
  }
  
  heightTree() {
    return height(this.rows)
  }
}
