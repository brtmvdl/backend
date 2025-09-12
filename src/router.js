import { HttpRequest } from './request.js'
import { HttpResponse } from './response.js'
import { NotFoundError } from '../libs/errors/index.js'

export class Router {
  requests = []

  constructor() {
    this.request('OPTIONS', '*', (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', req.getHeader('Origin', '*'))
      res.setHeader('Access-Control-Allow-Headers', req.getHeader('Access-Control-Request-Headers', '*'))
      res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      return res
    })
  }

  request(method = 'GET', pathname = '/', fn = (() => { })) {
    this.requests.push({ method, pathname, fn })

    return this
  }

  get(pathname = '/', fn = (() => { })) {
    return this.request('GET', pathname, fn)
  }

  post(pathname = '/', fn = (() => { })) {
    return this.request('POST', pathname, fn)
  }

  run(req = new HttpRequest(), res = new HttpResponse()) {
    const requestSegments = req.pathname.split('/')
    const cur = this.requests.find((r) => {
      const isMethod = r.method === '*' || r.method === req.method
      const routeSegments = r.pathname.split('/')
      if (routeSegments.length !== requestSegments.length) return false
      const isPathname = routeSegments.every((segment, index) => {
        const value = requestSegments[index]
        if (segment === value) return true
        if (segment[0] === ':') return value !== undefined && value !== ''
        return false
      })

      if (isMethod && isPathname) {
        routeSegments.forEach((segment, index) => {
          if (segment[0] === ':') req.setParam(segment.substring(1), requestSegments[index])
        })
      }

      return isMethod && isPathname
    })

    if (cur) return cur.fn(req, res)

    return res.setError(new NotFoundError(req.toJSON()))
  }
}
