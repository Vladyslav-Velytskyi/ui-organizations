import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// Folio
import { SearchAndSort } from '@folio/stripes/smart-components';
import { filters2cql } from '@folio/stripes/components';
import FormatTime from '../Utils/FormatTime';
import packageInfo from '../../package';
// Components and Pages
import PaneDetails from '../PaneDetails';
import { ViewVendor } from '../VendorViews';
import { Filters, SearchableIndexes } from '../Utils/FilterConfig';
import LanguageList from '../Utils/Languages';
import CountryList from '../Utils/Country';
import './Main.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const filterConfig = Filters();
const searchableIndexes = SearchableIndexes;

class Main extends Component {
  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: PropTypes.object,
    onSelectRow: PropTypes.func,
    onComponentWillUnmount: PropTypes.func,
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    disableRecordCreation: PropTypes.bool,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    browseOnly: PropTypes.bool,
  }

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  }

  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'Name'
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      clear: true,
      records: 'vendors',
      recordsRequired: '%{resultCount}',
      path: 'vendor-storage/vendors',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: (...args) => {
            /*
              This code is not DRY as it is copied from makeQueryFunction in stripes-components.
              This is necessary, as makeQueryFunction only referneces query paramaters as a data source.
              STRIPES-480 is intended to correct this and allow this query function to be replace with a call
              to makeQueryFunction.
              https://issues.folio.org/browse/STRIPES-480
            */
            const resourceData = args[2];
            const sortMap = {
              Name: 'name',
              Code: 'code',
              Description: 'description',
              endor_status: 'vendor_status',
            };

            const index = resourceData.query.qindex ? resourceData.query.qindex : 'all';
            const searchableIndex = searchableIndexes.find(idx => idx.value === index);

            let cql = searchableIndex.makeQuery(resourceData.query.query);
            const filterCql = filters2cql(filterConfig, resourceData.query.filters);
            if (filterCql) {
              if (cql) {
                cql = `(${cql}) and ${filterCql}`;
              } else {
                cql = filterCql;
              }
            }

            const { sort } = resourceData.query;
            if (sort) {
              const sortIndexes = sort.split(',').map((sort1) => {
                let reverse = false;
                if (sort1.startsWith('-')) {
                  // eslint-disable-next-line no-param-reassign
                  sort1 = sort1.substr(1);
                  reverse = true;
                }
                let sortIndex = sortMap[sort1] || sort1;
                if (reverse) {
                  sortIndex = `${sortIndex.replace(' ', '/sort.descending ')}/sort.descending`;
                }
                return sortIndex;
              });

              cql += ` sortby ${sortIndexes.join(' ')}`;
            }
            return cql;
          },
        },
        staticFallback: { params: {} },
      },
    },
    vendorCategory: {
      type: 'okapi',
      records: 'categories',
      path: 'vendor-storage/categories'
    },
    // vendorContactCategory: {
    //   type: 'okapi',
    //   records: 'categories',
    //   path: 'contact_category'
    // },
    queryCustom: {
      initialValue: {
        vendorIDQuery: 'query=(name=null)',
      }
    },
    vendorID: {
      type: 'okapi',
      records: 'vendors',
      path: 'vendor-storage/vendors',
      params: {
        query: (...args) => {
          // const newData = 'query=(id="d375f933-a093-4348-a594-0c02442946f3*")';
          const newData = `${args[2].queryCustom.vendorIDQuery}`;
          const cql = `${newData} sortby id`;
          return cql;
        },
      }
    },
    dropdown: {
      initialValue: {
        paymentMethodDD: [
          { label: '-- Select --', value: '' },
          { label: 'Cash', value: 'Cash' },
          { label: 'Credit Card/P-Card', value: 'Credit Card P Card' },
          { label: 'EFT', value: 'EFT' },
          { label: 'Deposit Account', value: 'Deposit Account' },
          { label: 'Physical Check', value: 'Physical_check' },
          { label: 'Bank Draft', value: 'Bank Draft' },
          { label: 'Internal Transfer', value: 'Internal Transfer' },
          { label: 'Other', value: 'other' },
        ],
        vendorEdiCodeDD: [
          {
            'label': '-- Select --',
            'value': ''
          },
          { label: 'Code', value: 'code' },
        ],
        vendorEdiCodeTypeDD: [
          { 'label': '-- Select --', 'value': '' },
          { label: '014/EAN', value: '014/EAN' },
          { label: '31B/US-SAN', value: '31B/US-SAN' },
          { label: '091/Vendor-assigned', value: '091/Vendor-assigned' },
          { label: '092/Customer-assigned', value: '092/Customer-assigned' },
        ],
        libraryEDICodeDD: [
          { label: '-- Select --', value: '' },
          { label: 'Code', value: 'code' },
        ],
        libraryEdiCodeTypeDD: [
          { label: '-- Select --', value: '' },
          { label: '31B', value: '31b' },
          { label: '31B/US-SAN', value: '31B/US-SAN' },
          { label: '091/Vendor-assigned', value: '091/Vendor-assigned' },
          { label: '092/Customer-assigned', value: '092/Customer-assigned' },
        ],
        ftpDD: [
          { label: '-- Select --', value: '' },
          { label: 'SFTP', value: 'sftp' },
          { label: 'FTP', value: 'ftp' },
        ],
        transmissionModeDD: [
          { label: '-- Select --', value: '' },
          { label: 'ASCII', value: 'ascii' },
          { label: 'Binary', value: 'binary' },
        ],
        connectionModeDD: [
          { label: '-- Select --', value: '' },
          { label: 'Active', value: 'active' },
          { label: 'Passive', value: 'passive' },
        ],
        deliveryMethodDD: [
          { label: '-- Select --', value: '' },
          { label: 'Online', value: 'online' },
          { label: 'FTP', value: 'ftp' },
          { label: 'Email', value: 'email' },
          { label: 'Other', value: 'other' },
        ],
        formatDD: [
          { label: '-- Select --', value: '' },
          { label: 'Counter', value: 'Counter' },
          { label: 'Delimited', value: 'delimited' },
          { label: 'Excel', value: 'excel' },
          { label: 'PDF', value: 'pdf' },
          { label: 'ASCII', value: 'ascii' },
          { label: 'HTML', value: 'html' },
          { label: 'Other', value: 'other' },
        ],
        statusDD: [
          { label: '-- Select --', value: '' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Pending', value: 'Pending' },
        ],
        categoriesDD: [
          'Accounting',
          'Books',
          'Customer Service',
          'Databases',
          'Ebooks',
          'Econtent',
          'General',
          'Journals',
          'Licenses',
          'Primary',
          'Sales',
          'Serials',
          'Returns',
          'Shipments',
          'Payments',
          'Technical Support',
          'Other'
        ],
        currencyDD: ['USD', 'CAD', 'GBP', 'EUR'],
        phoneTypeDD: [
          { label: '-- Select Type --', value: '' },
          { label: 'Office', value: 'Office' },
          { label: 'Mobile', value: 'Mobile' },
          { label: 'Fax', value: 'Fax' },
          { label: 'Other', value: 'Other' },
        ]
      }
    },
    CountryList: { initialValue: CountryList },
    LanguageList: { initialValue: LanguageList }
  });

  static getDerivedStateFromProps(props) {
    const langFilter = filterConfig.find(group => group.name === 'language');
    const countryFilter = filterConfig.find(group => group.name === 'country');
    if (langFilter.values.length === 0 && countryFilter.values.length === 0) {
      const langData = [...LanguageList].splice(1, LanguageList.length);
      const countryData = [...CountryList].splice(1, CountryList.length);
      langFilter.values = langData.map(rec => ({ name: rec.label, cql: rec.value }));
      countryFilter.values = countryData.map(rec => ({ name: rec.label, cql: rec.value }));
      props.mutator.initializedFilterConfig.replace(true);
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  create = (data) => {
    const { mutator } = this.props;
    // Convert time
    const time = FormatTime(data, 'post');
    if (time) { data.edi.edi_job.time = time; }
    mutator.records.POST(data).then(newLedger => {
      mutator.query.update({
        _path: `/vendors/view/${newLedger.id}`,
        layer: null
      });
    });
  }

  onChangeIndex = (e) => {
    const qindex = e.target.value;
    this.props.mutator.query.update({ qindex });
  }

  render() {
    const { onSelectRow, disableRecordCreation, onComponentWillUnmount, showSingleResult, browseOnly } = this.props;
    const resultsFormatter = {
      'Name': data => _.get(data, ['name'], ''),
      'Code': data => _.get(data, ['code'], ''),
      'Description': data => _.get(data, ['description'], ''),
      'Vendor Status': data => _.toString(_.get(data, ['vendor_status'], ''))
    };

    return (
      <SearchAndSort
        packageInfo={packageInfo}
        objectName="vendors"
        baseRoute={packageInfo.stripes.route}
        filterConfig={filterConfig}
        visibleColumns={this.props.visibleColumns ? this.props.visibleColumns : ['Name', 'Code', 'Description', 'Vendor Status']}
        resultsFormatter={resultsFormatter}
        viewRecordComponent={ViewVendor}
        onCreate={this.create}
        editRecordComponent={PaneDetails}
        newRecordInitialValues={{}}
        initialResultCount={INITIAL_RESULT_COUNT}
        resultCountIncrement={RESULT_COUNT_INCREMENT}
        finishedResourceName="perms"
        viewRecordPerms="vendor-storage.vendors.item.get"
        newRecordPerms="vendor-storage.vendors.item.post,login.item.post"
        parentResources={this.props.resources}
        parentMutator={this.props.mutator}
        detailProps={this.props.stripes}
        stripes={this.stripes}
        searchableIndexes={searchableIndexes}
        selectedIndex={_.get(this.props.resources.query, 'qindex')}
        searchableIndexesPlaceholder={null}
        onChangeIndex={this.onChangeIndex}
        onSelectRow={onSelectRow}
        disableRecordCreation={disableRecordCreation}
        onComponentWillUnmount={onComponentWillUnmount}
        browseOnly={browseOnly}
        showSingleResult={showSingleResult}
      />
    );
  }
}

export default Main;
