﻿/* globals describe expect it */
/* eslint-disable import/no-unresolved */
import { Iterable, EmptyIterable } from '../iterables';
import { expectList } from '../test-common';

describe('Empty lists:', () => {
  it('`EmptyIterable` class', () => {
    expect(EmptyIterable).toBeOfType('function');
    expect(EmptyIterable.prototype).toBeOfType(Iterable);
    expectList(new EmptyIterable(), []);
  });
}); // describe "Empty lists:"
