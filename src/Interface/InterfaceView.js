import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, KeyValue } from '@folio/stripes/components';
import css from './InterfaceView.css';
import BoolToCheckbox from '../Utils/BoolToCheckbox';

class InterfaceView extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.getInterface = this.getInterface.bind(this);
  }

  printKeyValue(label, val) {
    return (
      <Col xs={3}>
        <KeyValue label={<FormattedMessage id={`ui-vendors.interface.${label}`} />} value={val} />
      </Col>
    );
  }

  getInterface(val, key) {
    const rowCount = (this.props.initialValues.interfaces.length - 1) !== key;
    return (
      <Row key={key}>
        {this.printKeyValue('name', _.get(val, ['name'], ''))}
        {this.printKeyValue('uri', _.get(val, ['uri'], ''))}
        {this.printKeyValue('username', _.get(val, ['username'], ''))}
        {this.printKeyValue('password', _.get(val, ['password'], ''))}
        {this.printKeyValue('notes', _.get(val, ['notes'], ''))}
        <Col xs={12}>
          <div className={css.subHeadings}><b>{<FormattedMessage id="ui-vendors.interface.statistics" />}</b></div>
        </Col>
        <Col xs={3}>
          <KeyValue label={<FormattedMessage id="ui-vendors.interface.available" />}>
            <BoolToCheckbox name="Available" value={_.get(val, ['available'])} />
          </KeyValue>
        </Col>
        {this.printKeyValue('deliveryMethod', _.get(val, ['delivery_method'], ''))}
        {this.printKeyValue('statisticsFormat', _.get(val, ['statistics_format'], ''))}
        {this.printKeyValue('locallyStored', _.get(val, ['locally_stored'], ''))}
        {this.printKeyValue('onlineLocation', _.get(val, ['online_location'], ''))}
        {this.printKeyValue('statisticsNotes', _.get(val, ['statistics_notes'], ''))}
        {rowCount &&
          <div style={{ width: '100%' }}>
            <hr />
          </div>
        }
      </Row>
    );
  }

  render() {
    const { initialValues } = this.props;
    const dataVal = initialValues.interfaces.length >= 1 ? initialValues.interfaces : false;
    if (dataVal) {
      return (
        <div style={{ width: '100%' }} className={css.horizontalLine}>
          {dataVal.map(this.getInterface)}
        </div>
      );
    } else {
      return (
        <div>
          <p>{<FormattedMessage id="ui-vendors.interface.noInterfaceAvail" />}</p>
        </div>
      );
    }
  }
}

export default InterfaceView;
