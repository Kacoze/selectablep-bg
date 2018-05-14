import React from 'react';
import renderer from 'react-test-renderer';
import App from './index';

it('renders without crashing and match snapshoot', () => {
  const component = renderer.create(<App />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
  component.unmount();
});

it('changes bg color', () => {
  const component = renderer.create(<App />);
  component.root.instance.handleColorAccept('#dddddd');
  expect(component.toJSON()).toMatchSnapshot();
  component.unmount();
});
