/**
 * 工具函数
 */
import qs from 'qs'
const util = {}

/**
 * 获取当前url的某个参数值
 * @param  {string} name 参数名
 * @return {string}      参数值
 * 当前url: a.com/b=123&c=456
 * util.getQueryString(c) === '456'
 */
util.getQueryString = function(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const query = window.location.hash.split('?')
  if (query[1] === undefined) return null
  const r = query[1].match(reg)
  if (r != null) {
    return unescape(r[2])
  }
  return null
}

/**
 * 解析url参数字符串为object，便于取值
 * @param  {string} queryString query字符串
 * @return {object}      query hash
 * util.getQueryString('c=123&d=456') === {c: '123', d: '456'}
 */
util.parseQueryString = function(str) {
  const query = /\?/.test(str) ? str.split('?')[1] : str
  return qs.parse(query) || {}
}

/**
 * 更新url参数
 * @param  {String} uri url
 * @param  {Object} obj {query: value}
 * @return {String}     url?query
 *
 * util.updateQueryStringParameter('lvh.me?user=li', {user: 'chen', age: 123})
 * =>'lvh.me?user=chen&age=123'
 */

util.updateQueryStringParameter = function(uri = '', obj = {}, reset) {
  const url = uri || window.location.host
  const [host, queryStr] = url.split('?')
  const query = reset ? obj : util.parseQueryString(queryStr)
  _.extend(query, obj)
  return `${host}?${qs.stringify(query)}`
}

util.cache = {}
export default util
