import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import TetherComponent from 'react-tether';
import { Field, getFormValues } from 'redux-form';
import { MultiSelection, Col, Select, TextField } from '@folio/stripes/components';
import css from './css/MultiForms.css';
import { Required } from '../Utils/Validate';
import { FormattedMessage } from 'react-intl';

class PhoneNumbersMF extends Component {
  static propTypes = {
    dropdownVendorCategories: PropTypes.arrayOf(PropTypes.object),
    dropdownLanguages: PropTypes.arrayOf(PropTypes.object),
    dropdownPhoneType: PropTypes.arrayOf(PropTypes.object),
    stripes: PropTypes.shape({
      store: PropTypes.object
    }),
    dispatch: PropTypes.func,
    change: PropTypes.func,
    name: PropTypes.string,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { stripes: { store } } = nextProps;
    const arrPhones = [];
    const formValues = getFormValues('FormVendor')(store.getState());
    // Get Phone Number
    const getPhoneNum = () => {
      const num = formValues.phone_numbers;
      if (!num) return false;
      return num.map((val) => arrPhones.push(val));
    };
    getPhoneNum();
    // Get Phone Number
    const getAdditional = () => {
      const num = formValues.contacts;
      if (!num) return false;
      num.map((val) => {
        const contactPerson = val.contact_person;
        if (!contactPerson || contactPerson <= 0) return false;
        const phoneNums = contactPerson.phone_numbers;
        if (!phoneNums || phoneNums <= 0) return false;
        phoneNums.map((item) => arrPhones.push(item));
        return false;
      });
      return false;
    };
    getAdditional();
    // Remove Duplicates
    const arrItemsNoDuplicate = _.uniqBy(arrPhones, (e) => e.phone_number);
    // Update state
    if (!_.isEqual(arrItemsNoDuplicate, prevState.itemCollection)) {
      return { itemCollection: arrItemsNoDuplicate };
    }
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      filteredCollection: []
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputClear = this.onInputClear.bind(this);
    this.onClickItem = this.onClickItem.bind(this);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.fieldRef = React.createRef();
    return false;
  }

  // Input Actions
  // variables and prop names needs to be change for other use
  onInputChange(obj, e) {
    const { isOpen, itemCollection } = this.state;
    if (!_.isEmpty(itemCollection) && (e.trim().length >= 1)) {
      const num = itemCollection;
      const objFiltered = _.filter(num, (o) => {
        const phoneNumber = (o.phone_number || []);
        if (!_.includes(phoneNumber, e)) return false;
        return o;
      });

      if (!_.isEmpty(objFiltered) && !isOpen) {
        return this.setState({ isOpen: true, filteredCollection: objFiltered });
      } else if (_.isEmpty(objFiltered) && isOpen) {
        return this.setState({ isOpen: false, filteredCollection: [] });
      }
      return false;
    }

    if (isOpen) this.setState({ isOpen: false, filteredCollection: [] });
    return false;
  }

  onInputClear() {
    const { isOpen } = this.state;
    if (isOpen) this.setState({ isOpen: false, filteredCollection: [] });
  }

  onClickItem(name, item) {
    const { isOpen } = this.state;
    const { dispatch, change } = this.props;
    dispatch(change(`${name}`, item));
    if (isOpen) this.setState({ isOpen: false, filteredCollection: [] });
    return false;
  }

  onKeyPressed = () => {
    return false;
  }

  renderItem = (name) => {
    const { filteredCollection } = this.state;
    const listItems = filteredCollection.map((item, i) => {
      return (
        <div key={i}>
          <div className={css.inlineButton} onClick={() => this.onClickItem(name, item)} onKeyPress={(e) => this.onKeyPressed(e)} role="presentation">
            {item.phone_number}
          </div>
        </div>
      );
    });
    return (<div>{listItems}</div>);
  }
  // End Input Actions

  // Multi Select
  toString = (option) => option;
  formatter = ({ option }) => {
    const { dropdownVendorCategories } = this.props;
    const item = _.find(dropdownVendorCategories, { id: option }) || option;
    if (!item) return option;
    return <div>{item.value}</div>;
  };

  filterItems = (filterText, list) => {
    const filterRegExp = new RegExp(`^${filterText}`, 'i');
    const renderedItems = filterText ? list.filter(item => item.search(filterRegExp) !== -1) : list;
    return { renderedItems };
  };

  dataOptions() {
    const { dropdownVendorCategories } = this.props;
    if (!dropdownVendorCategories) return [];
    return dropdownVendorCategories.map(item => item.id) || [];
  }
  // End Multi Select

  render() {
    const { isOpen } = this.state;
    const {
      name,
      dropdownLanguages,
      dropdownPhoneType,
    } = this.props;
    const constraints = [{
      to: 'window',
      attachment: 'together',
    },
    {
      to: 'scrollParent',
      pin: false
    }];

    const defaultWidth = 100;
    const clientWidth = ((this.fieldRef || defaultWidth).current || defaultWidth).clientWidth || defaultWidth;

    return (
      <Fragment>
        <Col xs={12} md={3}>
          <TetherComponent
            attachment="top left"
            targetAttachment="bottom left"
            constraints={constraints}
          >
            <div ref={this.fieldRef} style={{ width:'100%' }}>
              <Field
                onChange={this.onInputChange}
                onClearField={this.onInputClear}
                label={<FormattedMessage id="ui-vendors.contactPeople.phoneNumberAst" />}
                name={`${name}.phone_number`}
                id={`${name}.phone_number`}
                component={TextField}
                validate={[Required]}
                fullWidth
              />
            </div>
            {
              isOpen && (
              <div className={css.dropdown} style={{ width:`${clientWidth}px` }}>
                <span className={css.dropDownItem}>
                  {this.renderItem(name)}
                </span>
              </div>
              )
            }
          </TetherComponent>
        </Col>
        <Col xs={12} md={3}>
          <Field label={<FormattedMessage id="ui-vendors.contactPeople.type" />} name={`${name}.type`} id={`${name}.type`} component={Select} fullWidth dataOptions={dropdownPhoneType} />
        </Col>
        <Col xs={12} md={3}>
          <Field label={<FormattedMessage id="ui-vendors.contactPeople.language" />} name={`${name}.language`} id={`${name}.language`} component={Select} fullWidth dataOptions={dropdownLanguages} />
        </Col>
        <Col xs={12} md={3}>
          <Field
            component={MultiSelection}
            label={<FormattedMessage id="ui-vendors.contactPeople.categories" />}
            name={`${name}.categories`}
            style={{ height: '80px' }}
            onBlur={(e) => { e.preventDefault(); }}
            dataOptions={this.dataOptions()}
            itemToString={this.toString}
            formatter={this.formatter}
            filter={this.filterItems}
          />
        </Col>
      </Fragment>
    );
  }
}

export default PhoneNumbersMF;
