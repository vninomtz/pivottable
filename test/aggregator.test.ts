import Aggregator, {AggregatorDef} from "../src/aggregator"

const defs: Array<AggregatorDef> = [
  {field: 'foo', op: 'count'},
  {field: 'bar', op: 'sum'},
  {field: 'baz', op: 'avg'},
]
const data: Array<Object> = [
  { foo: 2, bar: 3, baz: 9 },
  { foo: 2, bar: 3, baz: 9 },
  { foo: 2, bar: 3, baz: 10 },
]

describe("Test aggregator class", () => {
  it("Should calculate result of correct operations", () => {
    const expected: Array<number> = [3, 9, 9.333]

    const agg: Aggregator = Aggregator.create(defs)

    data.forEach(d => agg.add(d))

    defs.forEach((def, index) => {
      expect(agg.resultOf(def)).toBe(expected[index])
    })
  })
  it("Should copy correctly the instance of aggregator", () => {
    const dataEx: Object = { foo: 2, bar: 1, baz: 8 }
    
    const expectedPrev: Array<number> = [3, 9, 9.333]
    const expected: Array<number> = [1, 1, 8]

    const agg: Aggregator = Aggregator.create(defs)
    data.forEach(d => agg.add(d))

    const copy = agg.clone()
    copy.add(dataEx)

    defs.forEach((def, index) => {
      expect(agg.resultOf(def)).toBe(expectedPrev[index])
      expect(copy.resultOf(def)).toBe(expected[index])
    })
  })

})
