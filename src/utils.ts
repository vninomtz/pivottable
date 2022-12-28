export function uid(): String{
  const timestamp = Date.now() / 1000
  const random = Math.floor(Math.random() * timestamp)
  return `${timestamp.toString(36)}-${random}`
}

export function getKeyValues(obj: Object, keys: Array<string>): Array<any> {
  const values: Array<any> = []
  keys.forEach((key: string) => {
    if(key in obj){
      const val = (obj as any)[key]
      values.push(val)
    }
  })
  return values
}
