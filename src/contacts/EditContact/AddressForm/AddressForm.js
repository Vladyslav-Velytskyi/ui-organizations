import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiSelection,
  Select,
  TextField,
} from '@folio/stripes/components';

import ContactDetailsForm from '../ContactDetailsForm';

const addAddressFields = {
  fieldComponents: {
    addressLine1: TextField,
    addressLine2: TextField,
    city: TextField,
    stateRegion: TextField,
    zipCode: TextField,
    country: TextField,
    language: Select,
    categories: MultiSelection,
  },
  visibleFields: ['addressLine1', 'addressLine2', 'city', 'stateRegion', 'zipCode', 'country', 'language', 'categories'],
  requiredFields: ['addressLine1'],
};

const AddressForm = ({ store, change, dispatch, categories, categoriesFormatter, languageList = [] }) => (
  <ContactDetailsForm
    buttonName={<FormattedMessage id="ui-organizations.contactPeople.addAddress" />}
    categories={categories}
    categoriesFormatter={categoriesFormatter}
    change={change}
    dispatch={dispatch}
    emptyListMessage={<FormattedMessage id="ui-organizations.contactPeople.pleaseAddAddress" />}
    fieldsOptions={addAddressFields}
    label={<FormattedMessage id="ui-organizations.contactPeople.addAddress" />}
    labelForFieldsGroup={<FormattedMessage id="ui-organizations.contactPeople.address" />}
    labelForPrimaryFieldsGroup={<FormattedMessage id="ui-organizations.contactPeople.primaryAddress" />}
    languageList={languageList}
    name="addresses"
    store={store}
  />
);

AddressForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.object),
  categoriesFormatter: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  languageList: PropTypes.arrayOf(PropTypes.object),
  store: PropTypes.object.isRequired,
};

export default AddressForm;
