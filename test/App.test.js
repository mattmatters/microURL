import { describe, it } from 'mocha';
import { should } from 'chai';

should();


describe('Basic test', () => {
  it('should equal 2', () => {
    const test = 2;
    test.should.equal(2);
  });
});
