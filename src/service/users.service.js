const moment = require('moment');
const UserRepository = require('../dao/users.dao');
const { checkPassword } = require('../plugin/helper/bcrypt');
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
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  };

  const getUserByEmailId = async (email, password) => {
    const user = await userRepository.getUserByEmailId(email);

    if (user.password !== password) {
      throw Error('Password is not valid!');
    }
    console.log('getUserByEmailIdgetUserByEmailIdgetUserByEmailId', user);
    return {
      userId: user.user_id,
      username: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  };

  const getAdminAuthetication = async (email, password) => {
    const user = await userRepository.getAdminByUsername(email);

    if (user.password !== password) {
      throw Error('Password is not valid!');
    }

    return {
      userId: user.user_id,
      userName: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      isAdmin: true,
    };
  };

  const getInvestorAuthetication = async (userName, password) => {
    const user = await userRepository.getUserByUsername(userName);

    const match = await checkPassword(password, user.password);

    if (!match) {
      throw Error('Password is not valid!');
    }

    return {
      userId: user.user_id,
      userName: user.username,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  };

  // save user in db and return id
  const createInvestorUser = async (user) => {
    const userId = await userRepository.saveUser(user);
    return userId;
  };

  const creditInvestorFunds = async (funds) => {
    const transaction = await userRepository.creditInvestorFundsDao(funds);
    return transaction;
  };

  const withdrawInvestorFunds = async (funds) => {
    const balance = await userRepository.getInvestorFundBalanceDao(
      funds.userId
    );
    if (balance >= funds.amount) {
      const transaction = await userRepository.debitInvestorFundsDao(funds);
      return transaction;
    } else {
      return null;
    }
  };

  const debitInvestorFunds = async (funds) => {
    const transaction = await userRepository.debitInvestorFundsDao(funds);
    return transaction;
  };

  const getInvestorFundBalance = async (userId) => {
    const balance = await userRepository.getInvestorFundBalanceDao(userId);
    return balance;
  };

  const getInvestorWalletHistory = async (userId, offset, limit) => {
    const transactions = await userRepository.getInvestorFundBalanceDao(
      userId,
      offset,
      limit
    );
    return transactions;
  };

  const getAllInvestorWalletHistory = async (userId) => {
    const transactions = await userRepository.getAllInvestorWalletHistoryDao(
      userId
    );
    return transactions;
  };

  const getMarketHours = async (userId) => {
    const marketHours = await userRepository.getMarketHoursDao(userId);
    return {
      timeId: marketHours.time_id,
      startTime: marketHours.start_time,
      endTime: marketHours.end_time,
    };
  };

  const saveMarketHours = async (mh) => {
    const marketHours = await userRepository.saveMarketHoursDao(mh);
    return {
      timeId: marketHours.time_id,
      startTime: marketHours.start_time,
      endTime: marketHours.end_time,
    };
  };

  return {
    getUserById,
    createInvestorUser,
    getUserByEmailId,
    getInvestorAuthetication,
    getAdminAuthetication,
    creditInvestorFunds,
    debitInvestorFunds,
    getInvestorFundBalance,
    getAllInvestorWalletHistory,
    getInvestorWalletHistory,
    withdrawInvestorFunds,
    getMarketHours,
    saveMarketHours,
  };
};

module.exports = userService;
