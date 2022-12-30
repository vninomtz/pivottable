import Node from "./node"
import Aggregator, { AggregatorDef } from "./aggregator"
import {getKeyValues} from "./utils"

export interface PivotParams {
  data: Array<Object>
  rows: Array<string>
  columns: Array<string>
  aggDefs: Array<AggregatorDef>
}

function appendMatches(_node: Node, _keys: Array<string>, record: Object, match: string, agg: Aggregator){
  let keys = [..._keys]
  let node = _node
  let key = keys.shift()
  // add record to root to handle global agg
  node.addTotal(record)

  while (key !== undefined) {
    let n = node.findNodeByValue(key)
    if (n === undefined) {
      n = new Node()
      n.parent = node
      n.value = key
      node.nodes.push(n)
    }
    n.setTotal(agg.clone())
    if (match !== "") {
      n.setMatch(match, agg)
      n.addMatch(match, record)
    }
    n.addTotal(record)
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
    const {data, rows, columns, aggDefs} = params

    const root = new Node()
    const agg = Aggregator.create(aggDefs)
    root.setTotal(agg)

    data.forEach(record => {
      const rowValues = getKeyValues(record, rows)
      const colMatch = getKeyValues(record, columns).join("")
      appendMatches(root, rowValues, record, colMatch, agg.clone())
    })

    return new PivotData(root)
  }
  
  heightTree() {
    return height(this.rows)
  }
}
