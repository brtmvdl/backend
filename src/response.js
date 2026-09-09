import { HttpRequest } from '../src/request.js'
import { ApplicationError } from '../libs/errors/index.js'
import { BREAK_LINE } from './utils/constants.js'
import mimes from './response.mimes.js'
import fs from 'fs'

export class HttpResponse {
  status = '200'
  headers = new Headers()
  body = ''
  request = null

  constructor(request = new HttpRequest('')) {
    this.request = request
  }

  setStatus(status = '200') {
    this.status = status
    return this
  }

  parseContenType(file = '') {
    const parts = file.split('.')
    const ext = parts.length > 1 ? parts.pop() : ''
    const mime = mimes[ext]
    if (!mime) return 'text/plain'
    return mime
  }

  setHeader(key, value) {
    this.headers.set(key, value)
    return this
  }

  getHeader(key, def = null) {
    return this.headers.get(key) || def
  }

  readFile(file) {
    return fs.readFileSync(file).toString()
  }

  renderText(text = '', data = {}) {
    return Object.keys(data).reduce((rendered = '', key) => rendered.replace(`{{${key}}}`, data[key]), text)
  }

  setView(file, data = {}, status = this.getStatus()) {
    this.setStatus(status)
    this.setHeader('Content-Type', 'text/html')
    this.body = this.renderText(this.readFile(file), data)
    return this
  }

  setFile(file, status = this.getStatus()) {
    this.setStatus(status)
    this.setHeader('Content-Type', this.parseContenType(file))
    this.body = this.readFile(file)
    return this
  }

  setJSON(json = {}, status = this.getStatus()) {
    this.setStatus(status)
    this.setHeader('Content-Type', 'application/json')
    this.body = JSON.stringify(json, null, 4)
    return this
  }

  setText(text = '', status = this.getStatus()) {
    this.setStatus(status)
    this.setHeader('Content-Type', 'text/plain')
    this.body = text.toString()
    return this
  }

  setError(error = new Error()) {
    if (error instanceof ApplicationError) {
      return this.setJSON({ message: error.getMessage() }, error.getStatus())
    }

    return this.setJSON({ message: error.message }, '400')
  }

  redirect(pathname = '/', status = '302') {
    this.setStatus(status)
    this.setHeader('Location', pathname)
    return this
  }

  getStatus() {
    return (this.status || '400')
  }

  getStatusMessage(status = this.getStatus()) {
    switch (status.toString()) {
      case '200': return 'OK'
      case '301': return 'Moved Permanently'
      case '302': return 'Found'
      case '303': return 'See Other'
      case '304': return 'Not Modified'
      case '400': return 'Client Error'
      case '401': return 'Unauthorized'
      case '403': return 'Forbidden'
      case '404': return 'Not Found'
      case '405': return 'Method Not Allowed'
      case '500': return 'Server Error'
    }

    return 'Error'
  }

  getFirstLine(status = this.getStatus()) {
    const first = []
    first.push(this.request.protocol)
    first.push(status)
    first.push(this.getStatusMessage(status))
    return first.join(' ')
  }

  getHeaders() {
    return this.headers.headers.reduce((lines = [], [key, value]) => {
      lines.push([key, value].join(': '))
      return lines
    }, [])
  }

  toString() {
    return [
      this.getFirstLine(this.status),
      ...this.getHeaders(),
      '',
      this.body,
      '',
    ].join(BREAK_LINE)
  }

}
