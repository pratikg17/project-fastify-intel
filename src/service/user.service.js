const moment = require('moment');
const UserRepository = require('../dao/user.dao');

const userService = (fastify) => {
  const userRepository = UserRepository(fastify.db);

  const getUserById = async (userId) => {
    const user = await userRepository.getUserById(userId);

    return {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: moment(user.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(user.updated_at).format('DD/MM/YYYY'),
    };
  };

  const getUserByEmailId = async (email, password) => {
    const user = await userRepository.getUserByEmailId(email);

    if (user.password !== password) {
      throw Error('Password is not valid!');
    }

    return {
      id: user.id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: moment(user.created_at).format('DD/MM/YYYY'),
      updatedAt: moment(user.updated_at).format('DD/MM/YYYY'),
    };
  };

  // save user in db and return id
  const createInvestorUser = async (user) => {
    const userId = await userRepository.saveUser(user);
    return userId;
  };

  return { getUserById, createInvestorUser, getUserByEmailId };
};

module.exports = userService;
