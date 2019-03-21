import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import CategorySettings from './CategorySettings';

class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.pages = [
      {
        route: 'category',
        label: <FormattedMessage id="ui-vendors.settings.categories" />,
        component: CategorySettings,
        perm: 'settings.vendors.enabled'
      }
    ];
  }

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle={<FormattedMessage id="ui-vendors.settings.vendorSettings" />} />
    );
  }
}

export default SettingsPage;
