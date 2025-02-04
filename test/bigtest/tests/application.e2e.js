import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import Application from '../interactors/application';

describe('Application', () => {
  const app = new Application();

  setupApplication();

  beforeEach(function () {
    this.visit('/');
  });

  it('renders correctly', () => {
    expect(app.isPresent).to.be.true;
  });
});
