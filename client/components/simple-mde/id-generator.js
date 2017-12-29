let id = 0

module.exports = function generateId() {
  id += 1
  return `simplepostmd-editor-${id}`
}
