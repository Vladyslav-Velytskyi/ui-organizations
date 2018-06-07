import React, { Component } from 'react';
import PropTypes from 'prop-types';

class BoolTocheckbox extends Component {
  static propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool
    ])
  }

  render() {
    const { name, value } = this.props;
    const isChecked = value ? 'checked' : '';
    return (
      <input name={name} type="checkbox" checked={isChecked} disabled="disabled" />
    );
  }
}

export default BoolTocheckbox;
