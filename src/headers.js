// import {} from '../'

export class Headers {
  headers = []

  append(key, value = '') {
    this.headers.push([key, value])
    return this
  }

  set(key, value = '') {
    const index = this.headers.findIndex(([k]) => k === key)
    if (index >= 0) this.headers[index] = [key, value]
    else this.headers.push([key, value])
    return this
  }

  get(key, def = '') {
    const header = this.headers.find(([k]) => k === key)

    if (!header) return def

    return header[1]
  }

  toJSON() {
    return this.headers.reduce((json, [key, value]) => ({ ...json, [key]: value }), {})
  }

  toString() {
    return JSON.stringify(this.toJSON())
  }
}
