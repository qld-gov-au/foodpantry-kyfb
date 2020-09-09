/* eslint-disable */
import { expect, assert } from '@open-wc/testing';

describe('Testing the testing harness has been setup correctly', () => {
  it('true should be true', () => {
    expect(true).to.equal(true);
  });

  it('document should exist', () => {
    assert.isDefined(document);
  });
});
