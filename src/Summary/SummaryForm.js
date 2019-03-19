import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { Row, Col, Button, TextField, TextArea, Select } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { Required } from '../Utils/Validate';
import css from './SummaryForm.css';

class SummaryForm extends React.Component {
  static propTypes = {
    dropdownLanguages: PropTypes.arrayOf(PropTypes.object)
  };

  constructor(props) {
    super(props);
    this.renderList = this.renderList.bind(this);
    this.renderSubFields = this.renderSubFields.bind(this);
  }

  renderList = ({ fields }) => {
    return (
      <Row>
        <Col xs={6}>
          <div className={css.subHeadings}>{<FormattedMessage id="ui-vendors.summary.alternativeNames" />}</div>
        </Col>
        <Col xs={12}>
          {fields.length === 0 &&
            <div><em>{<FormattedMessage id="ui-vendors.summary.pleaseAddAltNames" />}</em></div>
          }
          {fields.map(this.renderSubFields)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button onClick={() => fields.push({})}>{<FormattedMessage id="ui-vendors.summary.add" />}</Button>
        </Col>
      </Row>
    );
  }

  renderSubFields = (elem, index, fields) => {
    return (
      <div key={index} className={css.panels}>
        <Row>
          <Col xs={5}>
            <Field label={<FormattedMessage id="ui-vendors.summary.aliasAst" />} name={`${elem}.value`} id={`${elem}.value`} validate={[Required]} component={TextField} fullWidth />
          </Col>
          <Col xs={5}>
            <Field label={<FormattedMessage id="ui-vendors.summary.description" />} name={`${elem}.description`} id={`${elem}.description`} component={TextField} fullWidth />
          </Col>
          <Col xs={1}>
            <Button onClick={() => fields.remove(index)} buttonStyle="danger" style={{ marginTop: '23px' }}>{<FormattedMessage id="ui-vendors.summary.remove" />}</Button>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    const statusOptions = [
      { label: 'Select Status', value: '' },
      { label: 'Pending', value: 'pending' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' }
    ];

    return (
      <Row>
        <Col xs={12}>
          <Field label={<FormattedMessage id="ui-vendors.summary.nameAst" />} name="name" id="name" validate={[Required]} component={TextField} fullWidth />
        </Col>
        <Col xs={12} md={6}>
          <Field label={<FormattedMessage id="ui-vendors.summary.codeAst" />} name="code" id="code" validate={[Required]} component={TextField} fullWidth />
          <Field label={<FormattedMessage id="ui-vendors.summary.accountingCode" />} name="erp_code" id="erp_code" component={TextField} fullWidth />
          <Field label={<FormattedMessage id="ui-vendors.summary.vendorStatusAst" />} name="vendor_status" id="vendor_status" validate={[Required]} component={Select} fullWidth dataOptions={statusOptions} />
          <Field label={<FormattedMessage id="ui-vendors.summary.defaultLanguage" />} name="language" id="language" component={Select} fullWidth dataOptions={this.props.dropdownLanguages} />
        </Col>
        <Col xs={12} md={6}>
          <Field label={<FormattedMessage id="ui-vendors.summary.description" />} name="description" id="description" component={TextArea} style={{ width: '100%', height: '139px' }} />
        </Col>
        <Col xs={12}>
          <FieldArray label="Vendor Names" name="aliases" id="aliases" component={this.renderList} />
        </Col>
      </Row>
    );
  }
}

export default SummaryForm;
