import React from 'react'
// import SimpleMDE from 'simplemde'
import PropTypes from 'prop-types'
import generateId from './generator-id'

const NOOP = () => {}

export default class Editor extends React.Component {
  constructor() {
    super()
    this.state = {
      keyChange: false,
    }
    this.eventWrapper = this.eventWrapper.bind(this)
  }

  componentWillMount() {
    const { id } = this.props
    if (id) {
      this.id = id
    } else {
      this.id = generateId()
    }
  }

  componentDidMount() {
    this.createEditor()
    this.addEvents()
    this.addExtraKeys()
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.keyChange && (nextProps.value !== this.simplemde.value())) {
      this.simplemde.value(nextProps.value)
    }

    this.setState({
      keyChange: false,
    })
  }

  componentWillUnmount() {
    this.removeEvents()
  }

  createEditor() {
    const SimpleMDE = require('simplemde') // eslint-disable-line
    const initialOptions = {
      element: document.getElementById(this.id),
      initialValue: this.props.value,
    }

    const allOptions = Object.assign({}, initialOptions, this.props.options)
    this.simplemde = new SimpleMDE(allOptions)
  }

  eventWrapper() {
    this.setState({
      keyChange: true,
    })
    this.props.onChange(this.simplemde.value())
  }

  removeEvents() {
    this.editorEl.removeEventListener('keyup', this.eventWrapper)
    if (this.editorToolbarEl) {
      this.editorToolbarEl.removeEventListener('click', this.eventWrapper)
    }
  }

  addEvents() {
    const wrapperId = `${this.id}-wrapper`
    const wrapperEl = document.getElementById(`${wrapperId}`)

    this.editorEl = wrapperEl.getElementsByClassName('CodeMirror')[0]
    this.editorToolbarEl = wrapperEl.getElementsByClassName('editor-toolbar')[0]

    this.editorEl.addEventListener('keyup', this.eventWrapper)
    if (this.editorToolbarEl) {
      this.editorToolbarEl.addEventListener('click', this.eventWrapper)
    }
  }

  addExtraKeys() {
    // https://codemirror.net/doc/manual.html#option_extraKeys
    if (this.props.extraKeys) {
      this.simplemde.codemirror.setOption(
        'extraKeys',
        this.props.extraKeys,
      )
    }
  }

  render() {
    const textarea = React.createElement('textarea', { id: this.id })
    return React.createElement('div', { id: `${this.id}-wrapper`, className: this.props.className }, textarea)
  }
}

Editor.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.object,
  value: PropTypes.string,
  extraKeys: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
}

Editor.defaultProps = {
  onChange: NOOP,
  options: {},
  value: '',
  extraKeys: '',
  className: '',
  id: '',
}
