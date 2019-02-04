import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Row, Col, KeyValue } from '@folio/stripes/components';
import css from '../ContactInformationView.css';
import LanguageLookup from '../../Utils/LanguageLookup';

class ContactInformationView extends React.Component {
  static propTypes = {
    dataVal: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);
    this.getEmail = this.getEmail.bind(this);
  }

  getEmail(val, key) {
    const rowCount = (this.props.dataVal.length - 1) !== key;
    const categories = val.categories.join(', ') || null;
    const getLanguage = LanguageLookup(_.get(val, 'language', ''));

    return (
      <Row key={key}>
        <Col xs={5}>
          <KeyValue label="Email" value={`${_.get(val, 'value', '')}`} />
        </Col>
        <Col xs={4}>
          <KeyValue label="Categories" value={categories} />
        </Col>
        <Col xs={3}>
          <KeyValue label="Language" value={getLanguage} />
        </Col>
        {rowCount &&
          <div style={{ width: '100%' }}>
            <hr />
          </div>
        }
      </Row>
    );
  }

  render() {
    const { dataVal } = this.props;
    return (
      <Col xs={12} className={css.rowHeader}>
        <div className={css.subHeadings}>Email Address</div>
        {dataVal.map(this.getEmail)}
      </Col>
    );
  }
}

export default ContactInformationView;
