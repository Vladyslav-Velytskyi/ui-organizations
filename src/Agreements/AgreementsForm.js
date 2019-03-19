import React, { Component } from 'react';
import { Field, FieldArray } from 'redux-form';
import { Row, Col, Button, TextField, TextArea } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { Required, isURLValid } from '../Utils/Validate';
import css from './AgreementsForm.css';

class AgreementsForm extends Component {
  constructor(props) {
    super(props);
    this.renderForm = this.renderForm.bind(this);
    this.renderSubForm = this.renderSubForm.bind(this);
  }

  renderForm = ({ fields }) => {
    return (
      <Row>
        <Col xs={12}>
          {fields.length === 0 &&
            <Col xs={6}>
              <div><em>{<FormattedMessage id="ui-vendors.agreement.pleaseAddAgreements" />}</em></div>
            </Col>
          }
          {fields.map(this.renderSubForm)}
        </Col>
        <Col xs={12} style={{ paddingTop: '10px' }}>
          <Button onClick={() => fields.push({})}>{<FormattedMessage id="ui-vendors.agreement.add" />}</Button>
        </Col>
      </Row>
    );
  }

  renderSubForm = (elem, index, fields) => {
    return (
      <div key={index} className={css.panels}>
        <Row key={index}>
          <Col xs={12} md={4}>
            <Field label={<FormattedMessage id="ui-vendors.agreement.nameAst" />} name={`${elem}.name`} id={`${elem}.name`} validate={[Required]} component={TextField} fullWidth />
          </Col>
          <Col xs={12} md={4}>
            <Field label={<FormattedMessage id="ui-vendors.agreement.discountSym" />} name={`${elem}.discount`} id={`${elem}.discount`} type="number" component={TextField} fullWidth />
          </Col>
          <Col xs={12} md={4}>
            <Field label={<FormattedMessage id="ui-vendors.agreement.referenceUrl" />} name={`${elem}.reference_url`} id={`${elem}.reference_url`} validate={[isURLValid]} type="text" component={TextField} fullWidth />
          </Col>
          <Col xs={12}>
            <Field label={<FormattedMessage id="ui-vendors.agreement.notes" />} name={`${elem}.notes`} id={`${elem}.notes`} component={TextArea} fullWidth />
          </Col>
          <Col xs={12} style={{ textAlign: 'right' }}>
            <Button onClick={() => fields.remove(index)} buttonStyle="danger">
              {<FormattedMessage id="ui-vendors.agreement.remove" />}
            </Button>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <FieldArray label="Agreements" name="agreements" id="agreements" component={this.renderForm} />
        </Col>
      </Row>
    );
  }
}

export default AgreementsForm;
