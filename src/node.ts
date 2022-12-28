import {uid} from "./utils"

export default class Node {
  id: String
  nodes: Array<Node> = []
  parent?: Node
  value?: any
  records: Array<Object> = []

  constructor(){
    this.id = uid()
  }

  findNodeByValue(val: any) {
    return this.nodes.find(n => n.value === val)
  }
}
