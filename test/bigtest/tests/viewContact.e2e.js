import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';

import {
  ViewContactInteractor,
} from '../interactors';

describe('View contact', () => {
  setupApplication();

  const viewContact = new ViewContactInteractor();

  beforeEach(function () {
    const contact = this.server.create('contact');

    return this.visit(`/organizations/contacts/${contact.id}/view`, () => {
      expect(viewContact.$root).to.exist;
    });
  });

  describe('actions', () => {
    it('should be present', () => {
      expect(viewContact.actions.isPresent).to.be.true;
    });
  });

  describe('contact person section', () => {
    it('should be present', () => {
      expect(viewContact.contactPerson.isPresent).to.be.true;
    });
  });

  describe('click unassign button', () => {
    beforeEach(async function () {
      await viewContact.paneHeaderCenterButton.click();
      await viewContact.unassignButton.click();
    });

    it('confirmation modal for unassign should be presented', () => {
      expect(viewContact.unassignConfirmation.isPresent).to.be.true;
    });

    describe('click confirm unassign button', () => {
      beforeEach(async function () {
        await viewContact.unassignConfirmation.confirmButton.click();
      });

      it('confirmation modal for unassign should disappear', () => {
        expect(viewContact.unassignConfirmation.isPresent).to.be.false;
      });
    });
  });

  describe('click delete button', () => {
    beforeEach(async function () {
      await viewContact.paneHeaderCenterButton.click();
      await viewContact.deleteButton.click();
    });

    it('confirmation modal for delete should be presented', () => {
      expect(viewContact.deleteConfirmation.isPresent).to.be.true;
    });

    describe('click confirm delete button', () => {
      beforeEach(async function () {
        await viewContact.deleteConfirmation.confirmButton.click();
      });

      it('confirmation modal for delete should disappear', () => {
        expect(viewContact.deleteConfirmation.isPresent).to.be.false;
      });
    });

    describe('click cancel delete button', () => {
      beforeEach(async function () {
        await viewContact.deleteConfirmation.cancelButton.click();
      });

      it('confirmation modal for delete should disappear', () => {
        expect(viewContact.deleteConfirmation.isPresent).to.be.false;
      });
    });
  });
});
