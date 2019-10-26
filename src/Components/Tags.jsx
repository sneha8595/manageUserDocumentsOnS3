import React from 'react';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

class Tags extends React.Component {
  constructor(props) {
    super(props)
    this.state = {tags: []}
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(tags) {
    this.setState({tags})
  }

  render() {
    return <TagsInput value={this.state.tags} onChange={this.handleChange} />
  }
}

export default Tags;