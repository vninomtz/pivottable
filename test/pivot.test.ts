import PivotData, {flatTree, height, ItemNode, PivotParams} from '../src/pivot'
import Node from '../src/node'
import Aggregator from '../src/aggregator'


describe("test pivot func", () => {
  it('should return test', ()=> {
    const params: PivotParams  = {
      data: [
        {key1: 'foo', key2: 'bar', key3: 'baz', key4: 2, key5: 'foobar'},
        {key1: 'bar', key2: 'foo', key3: 'baz', key4: 2, key5: 'foobaz'},
        {key1: 'foo', key2: 'baz', key3: 'bar', key4: 2, key5: 'foobaz'},
        {key1: 'foo', key2: 'baz', key3: 'foo', key4: 2, key5: 'foobar'},
        {key1: 'foo', key2: 'baz', key3: 'foo', key4: 2, key5: ''},
      ],
      rows: ['key1', 'key2', 'key3'],
      columns: ['key5'],
      aggDefs: [
        {field: 'key1', op: 'count'},
        {field: 'key4', op: 'sum'},
        {field: 'key4', op: 'avg'},
      ]
    }
    const items: Array<ItemNode> = []
    const data = PivotData.pivot(params)
    flatTree(data.rows, items, 0)
    expect(data).toBeInstanceOf(PivotData)
    expect(height(data.rows)).toBe(params.rows.length)
    expect(items.length).toBe(10)
    // console.log(data.rows.total())

    const foo_1 = items.find(n => n.depth === 1 && n.node.value === 'foo')
    let agg = foo_1?.node.aggTotal()
    expect(agg).toBeInstanceOf(Aggregator)
    expect(agg?.resultOf({field:'key1', op: 'count'})).toBe(4)
    const foo_3 = items.find(n => n.depth === 3 && n.node.value === 'foo')
    agg = foo_3?.node.aggTotal()
    console.log(foo_3?.node)
  })
})
