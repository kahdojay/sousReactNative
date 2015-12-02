// __tests__/registration-test.js
import Connect from '../utilities/connect'

describe('registration', () => {
  beforeEach(() => {
    const ddpClient = new Connect()
  })
  it('connection', () => {
    console.log(ddpClient)
    expect(ddpClient).toBeTruthy();
  });
});
