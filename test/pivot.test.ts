import PivotData, {flatTree, height, ItemNode} from '../src/pivot'
import Node from '../src/node'


describe("test pivot func", () => {
  it('should return test', ()=> {
    const params = {
      data: [
        {key1: 'foo', key2: 'bar', key3: 'baz'},
        {key1: 'bar', key2: 'foo', key3: 'baz'},
        {key1: 'foo', key2: 'baz', key3: 'bar'},
        {key1: 'foo', key2: 'baz', key3: 'foo'},
        {key1: 'foo', key2: 'baz', key3: 'foo'},
      ],
      rows: ['key1', 'key2', 'key3'],
      columns: ['bar']
    }
    const items: Array<ItemNode> = []
    const data = PivotData.pivot(params)
    flatTree(data.rows, items, 0)
    expect(data).toBeInstanceOf(PivotData)
    expect(height(data.rows)).toBe(params.rows.length)
    expect(items.length).toBe(10)

    const foo_1 = items.find(n => n.depth === 1 && n.node.value === 'foo')
    const foo_3 = items.find(n => n.depth === 3 && n.node.value === 'foo')
    expect(foo_1?.node).toBeInstanceOf(Node)
    expect(foo_1?.node.records.length).toEqual(4)
    expect(foo_3?.node.records.length).toEqual(2)
    expect(data.rows.records.length).toEqual(5)
  })
})
