/* eslint-disable import/no-extraneous-dependencies,
   no-unused-expressions, react/jsx-filename-extension */
import { shallow } from 'enzyme';
import { describe, it } from 'mocha';
import { should } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
// import App from '../src/containers/appContainer';
import { MOO, moo } from '../src/actions/index';
// import mooReducer from '../src/reducers/mooReducer';
import { mapStateToProps } from '../src/containers/UserListContainer';
import User from '../src/components/User';

should();
/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
*/

// Actions
describe('Actions', () => {
  it('should return MOO action', () => {
    moo().should.be.deep.equal({
      type: MOO,
    });
  });
});

/*
// Reducers
describe('Reducers', () => {
  describe('mooReducer', () => {
    it('should initialize empty', () => {
      mooReducer(undefined, 'INIT').should.be.deep.equal({ cowText: '' });
    });
    it('should append moo to text', () => {
      mooReducer({ cowText: 'cow' }, { type: MOO }).should.be.deep.equal({ cowText: 'cowmoo' });
    });
  });
});
*/

// Components
describe('Components', () => {
  describe('User', () => {
    const wrapper = shallow(<User username="poop" lastupdate="never" allTime={23} recent={2} />);
    it('renders without exploding', () => {
      wrapper.should.have.length(1);
    });
  });
});


// Containers
describe('Containers', () => {
  describe('appContainer', () => {
    it('should map props', () => {
      mapStateToProps({ mooReducer: { cowText: '' } }).should.be.deep.equal({ text: '' });
    });
  });
});
