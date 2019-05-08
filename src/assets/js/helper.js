import util from 'src/assets/js/util'
export default {
  onEnterEach(name, routeData = {}) {
    const { options = {} } = routeData
    if (!options.keepScroll) {
      document.scrollingElement.scrollTop = 0
    }
  },
  updateQuery(opts = {}) {
    const { url, params, reset } = opts
    const newUrl = util.updateQueryStringParameter(
      url || window.location.hash || '?',
      params,
      reset
    )
    this.navigate(newUrl, { trigger: true })
  },
}
