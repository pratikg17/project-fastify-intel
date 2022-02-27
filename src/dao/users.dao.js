const { createPasswordHash } = require('../plugin/helper/bcrypt');
const roleDao = require('./roles.dao');

const userRepository = (db) => {
  // Get user by user id
  const getUserById = async (userId) => {
    try {
      const user = await db.one('select * from users where id = $1', [userId]);
      return user;
    } catch {
      throw Error(`${userId} does not exist`);
    }
  };

  const getUserByEmailId = async (email) => {
    try {
      const user = await db.one('select * from users where email = $1', [
        email,
      ]);
      return user;
    } catch {
      throw Error(`${email} does not exist!`);
    }
  };

  const getUserByUsername = async (userName) => {
    try {
      const user = await db.one('select * from users where username = $1', [
        userName,
      ]);
      return user;
    } catch {
      throw Error(`${userName} does not exist!`);
    }
  };

  const getAdminByUsername = async (userName) => {
    try {
      const user = await db.one(
        "select * from users u join roles r on r.role_id  = u.role_id  where r.type = 'ADMIN' and username = $1",
        [userName]
      );
      return user;
    } catch {
      throw Error(`${userName} does not exist!`);
    }
  };

  // save user in db
  const saveUser = async (user) => {
    try {
      const investorRoleId = await roleDao(db).getInvestorRole();

      console.log(createPasswordHash);
      const password = await createPasswordHash(user.password);

      const { user_id } = await db.one(
        'INSERT INTO users(first_name, last_name, username, password, email, role_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING user_id',
        [
          user.firstName,
          user.lastName,
          user.userName,
          password,
          user.email,
          investorRoleId.role_id,
        ]
      );
      return user_id;
    } catch (error) {
      console.log(error.message);
      throw Error('Not valid user data - failed to save in db');
    }
  };

  const creditInvestorFundsDao = async (funds) => {
    try {
      const trasaction = await db.one(
        `INSERT INTO investor_funds
      (debit_amount, credit_amount, description, user_id, "transaction_type", trasactiondate)
      VALUES(0, $1, 'Added funds to wallet', $2, 'CREDIT', now()) returning *;
      `,
        [funds.amount, funds.userId]
      );
      return trasaction;
    } catch (err) {
      console.log(err);
      throw Error(`${funds.userId} does not exist`);
    }
  };

  const debitInvestorFundsDao = async (funds) => {
    try {
      const trasaction = await db.one(
        `INSERT INTO investor_funds
      (debit_amount, credit_amount, description, user_id, "transaction_type", trasactiondate)
      VALUES($1, 0,  $2, $3, 'DEBIT', now())  returning *;
      `,
        [funds.amount, 'Withdrawal Request Processed', funds.userId]
      );
      return trasaction;
    } catch {
      throw Error(`${funds.userId} does not exist`);
    }
  };

  const creditInvestorFundsForTradeDao = async (funds) => {
    try {
      const trasaction = await db.one(
        `INSERT INTO investor_funds
      (debit_amount, credit_amount, description, user_id, "transaction_type", trasactiondate)
      VALUES(0, $1, $2, $3, 'CREDIT', now()) returning *;
      `,
        [funds.creditAmount, funds.description, funds.userId]
      );
      return trasaction;
    } catch (err) {
      console.log(err);
      throw Error(`${funds.userId} Credit  does not exist`);
    }
  };

  const debitInvestorFundsForTradeDao = async (funds) => {
    try {
      const trasaction = await db.one(
        `INSERT INTO investor_funds
      (debit_amount, credit_amount, description, user_id, "transaction_type", trasactiondate)
      VALUES($1, 0,  $2, $3, 'DEBIT', now())  returning *;
      `,
        [funds.debitAmount, funds.description, funds.userId]
      );
      return trasaction;
    } catch {
      throw Error(`${funds.userId} Debit does not exist`);
    }
  };

  const getInvestorFundBalanceDao = async (userId) => {
    try {
      const { balance } = await db.one(
        `select coalesce((sum(credit_amount) - sum (debit_amount)),0 ) as "balance" from investor_funds   
        where user_id =$1;
      `,
        [userId]
      );
      return balance;
    } catch {
      throw Error(`${userId} does not exist`);
    }
  };

  const getInvestorWalletHistoryDao = async (userId, limit, offset) => {
    try {
      const wallet = await db.query(
        `select * from investor_funds where user_id = $1 limit $2 offset $3`,
        [userId, limit, offset]
      );

      return wallet;
    } catch (error) {
      throw Error('failed to fetch investor_funds records from db');
    }
  };

  const getAllInvestorWalletHistoryDao = async (userId) => {
    try {
      const wallet = await db.query(
        `select * from investor_funds where user_id='${userId}' order by created_at DESC`
      );
      return wallet;
    } catch (error) {
      throw Error('failed to fetch investor_funds records from db');
    }
  };

  return {
    getUserById,
    saveUser,
    getUserByEmailId,
    getUserByUsername,
    getAdminByUsername,
    creditInvestorFundsDao,
    debitInvestorFundsDao,
    getInvestorFundBalanceDao,
    getAllInvestorWalletHistoryDao,
    getInvestorWalletHistoryDao,
    debitInvestorFundsForTradeDao,
    creditInvestorFundsForTradeDao,
  };
};

module.exports = userRepository;
