type TypeOperaton = 'count' | 'sum' | 'avg' // | 'min' | 'max' enable when build the classes

interface Operation {
  field?: string
  push: (record: Object) => void
  result: () => number | undefined
}
class Counter implements Operation {
  count: number = 0
  field: string

  constructor(field: string){
    this.field = field
  }

  push(record: Object): void {
    if (this.field in record) {
      this.count += 1
    }
  }
  result(): number {
    return this.count
  }
}

class Sum implements Operation {
  field: string
  sum?: number

  constructor(field: string){
    this.field = field
  }
  push(record: any): void {
    if (this.field in record) {
      const num = parseFloat(record[this.field])
      if(!Number.isNaN(num)){
        if (this.sum === undefined) {
          this.sum = num
        }else {
          this.sum += num
        }
      }
    }
  }
  result(): number | undefined {
    return this.sum
  }
}
class Average implements Operation {
  field: string
  sum?: number
  records: number = 0

  constructor(field: string){
    this.field = field
  }
  push(record: any): void {
    if (this.field in record) {
      const num = parseFloat(record[this.field])
      if(!Number.isNaN(num)){
        this.records += 1
        if (this.sum === undefined) {
          this.sum = num
        }else {
          this.sum += num
        }
      }
    }
  }
  result(): number | undefined {
    if (this.sum === undefined) {
      return undefined
    }
    const res = this.sum / this.records
    return parseFloat(res.toFixed(3))
  }
}

function opBuilder(def: AggregatorDef): Operation {
  let op: Operation
  switch (def.op) {
    case 'count':
      op = new Counter(def.field)
      break;
    case 'sum':
      op = new Sum(def.field)
      break;
    case 'avg':
      op = new Average(def.field)
      break;
    default:
      op = new Counter(def.field)
      break;
  }
  return op
}

export interface AggregatorDef {
  field: string
  op: TypeOperaton
}

type ResultSet = {[key: string]: Operation}

export default class Aggregator {
  defs: Array<AggregatorDef> = []
  resultSet: ResultSet = {}

  constructor(defs: Array<AggregatorDef>){
    this.defs = defs
  }

  static create(defs: Array<AggregatorDef>): Aggregator {
    const agg = new Aggregator(defs)
    defs.forEach(def => {
      agg.setDef(def)
    });
    return agg
  }

  clone(): Aggregator {
    return Aggregator.create(this.defs)
  }

  setDef(def: AggregatorDef){
    const key: string = `${def.field}${def.op}`
    const op: Operation = opBuilder(def)
    this.resultSet[key] = op
  }

  add(obj: Object): void {
    Object.values(this.resultSet).forEach(op => op.push(obj))
  }

  resultOf(def: AggregatorDef): number | undefined {
    const key: string = `${def.field}${def.op}`
    return this.resultSet[key].result()
  }
}
