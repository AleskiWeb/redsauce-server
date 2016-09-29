var users = [
  {
    // User with admin rights
    _id: '762fa052-19f6-48a7-9704-701362885ef5',
    username: 'lexi.admin',
    firstName: 'Lexi',
    lastName: 'Admin',
    email: 'admin@test.com',
    password: 'Admintest1!',
    store_id: '101',
    achievements : [
      { earned: true, _id: '762fa052-19f6-48a7-9704-701362885ef5' }, 
      { earned: false, _id: '33634f75-3f47-4679-a064-2affe1620513' }
    ],
    personalDetails: {
        firstName: "test",
        lastName: "tester"
    },
    role: 'admin'
  },
  {
    // User with no role - Auto generates to 'user'
    _id: '33634f75-3f47-4679-a064-2affe1620513',
    username: 'john.user',
    firstName: 'John',
    lastName: 'User',
    email: 'user@test.com',
    password: 'Usertest1!',
    store_id: '102',
    achievements : [
      { earned: false, _id: 'b391f053-c4d3-4a71-b2e7-39116e662d68' }
    ],
    personalDetails: {
        firstName: "test",
        lastName: "tester"
    },
    role: 'user'
  }
];

module.exports = users;
