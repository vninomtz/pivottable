import {uid, getKeyValues} from "../src/utils"


describe("Test utils functions", () => {
  it('should create uniques ids', ()=> {
    const uids: Set<String> = new Set()
    let repeated = false
    for (let i = 0; i < 10000; i++) {
      const id = uid()
      if ( uids.has(id)) {
        console.log(id, i)
        repeated = true
        break
      } else {
        uids.add(id)
      }
    }
    expect(repeated).toBeFalsy()
  })
  it('should return the key values of a object', () => {
    const obj: Object = {foo: 'foo', bar: true, baz: 200, foobar: null}

    expect(getKeyValues(obj, ['foo'])).toEqual(['foo'])
    expect(getKeyValues(obj, ['foo', 'bar'])).toEqual(['foo', true])
    expect(getKeyValues(obj, ['foo', 'bar', 'baz'])).toEqual(['foo', true, 200])
    expect(getKeyValues(obj, ['foobar'])).toEqual([null])
  })
})
