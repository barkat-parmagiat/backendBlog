const {
  register,
  login,
  changePassword,
  profile,
  updateProfile,
  getAllUser,
  followData,
  getFriendsList,
  getFollowerList,
  unFollowData,
} = require('../auth');

describe('register testing', () => {
  it('registration successfully', () => {
    const user = {
      fullname: 'test',
      email: 'test@gmail.com',
      password: 'test',
      dob: '2020-01-01',
    };
    expect(register(user)).toBeTruthy();
  });
});

describe('get all user', () => {
  test('the data all user', async () => {
    const response = await getAllUser();
    const data = response.data;
    expect(data).toBe('Barkat');
  });
});
