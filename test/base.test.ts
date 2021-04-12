import { StateModel } from '../src/index';

describe('base', () => {
  test('base', () => {
    const model = new StateModel<number>(0);
    expect(model.state).toEqual(0);

    model.setState(1);
    expect(model.state).toEqual(1);

    let { state } = model;
    const off = model.on(() => {
      state = (() => model.state)();
    });

    model.setState(2);
    expect(model.state).toEqual(2);
    expect(state).toEqual(2);

    off();

    model.setState(3);
    expect(model.state).toEqual(3);
    expect(state).toEqual(2);
  });
});