import Aggregator from "./aggregator"
import {uid} from "./utils"

type MatchSet = {[key: string]: Aggregator}

export default class Node {
  id: String
  nodes: Array<Node> = []
  parent?: Node
  value?: any
  matchSet: MatchSet = {}

  constructor(){
    this.id = uid()
  }

  findNodeByValue(val: any): Node | undefined {
    return this.nodes.find(n => n.value === val)
  }

  setTotal(agg: Aggregator): void{
    this.setMatch('total', agg)
  }

  setMatch(match: string, agg: Aggregator): void {
    if (!(match in this.matchSet)) {
      this.matchSet[match] = agg
    }
  }

  addMatch(match: string, record: any): void {
    if (match in this.matchSet) {
      this.matchSet[match].add(record)
    }
  }

  addTotal(record: any): void {
    this.addMatch('total', record)
  }

  aggOf(match: string): Aggregator {
    return this.matchSet[match]
  }

  aggTotal(): Aggregator {
    return this.aggOf('total')
  }
  
}
