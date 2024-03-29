const UserService = require('../../service/users.service');
const RolesService = require('../../service/roles.service');
const {
  postRequestBody,
  postResponseBody,
  getRequestparams,
  getResponseBody,
} = require('./users.schema');

// make sure to mark function as async
const userRoute = async (fastify) => {
  const {
    getUserById,
    createInvestorUser,
    getUserByEmailId,
    getInvestorAuthetication,
    getAdminAuthetication,
    creditInvestorFunds,
    debitInvestorFunds,
    getInvestorFundBalance,
    getAllInvestorWalletHistory,
    withdrawInvestorFunds,
    getMarketHours,
    saveMarketHours,
  } = UserService(fastify);

  fastify.get(
    '/:userId',
    { schema: { params: getRequestparams, response: getResponseBody } },
    async (request, reply) => {
      const { userId } = request.params;
      try {
        const user = await getUserById(userId);
        reply.code(200).send(user);
      } catch (error) {
        reply.code(404).send(error);
      }
    }
  );

  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body;

      const user = await getUserByEmailId(email, password);

      // create jwt token
      const token = fastify.jwt.sign(user);

      reply.code(200).send({ token: `Bearer ${token}` });
    } catch (err) {
      reply.code(401).send({
        message: err.message,
      });
    }
  });

  fastify.post('/investor-login', async (request, reply) => {
    try {
      const { userName, password } = request.body;

      const user = await getInvestorAuthetication(userName, password);
      console.log('useruseruser', user);
      // create jwt token
      const token = fastify.jwt.sign(user);

      reply.code(200).send({ token: `Bearer ${token}` });
    } catch (err) {
      reply.code(401).send({
        message: err.message,
      });
    }
  });

  fastify.post('/admin-login', async (request, reply) => {
    try {
      const { userName, password } = request.body;

      const user = await getAdminAuthetication(userName, password);

      // create jwt token
      const token = fastify.jwt.sign(user);

      reply.code(200).send({ token: `Bearer ${token}` });
    } catch (err) {
      reply.code(401).send({
        message: err.message,
      });
    }
  });

  fastify.post('/add-investor-funds', async (request, reply) => {
    // authenticate request
    await fastify.authenticate(request, reply);
    const funds = request.body;
    const transaction = await creditInvestorFunds(funds);
    reply.code(201).send({ transaction });
  });

  fastify.post('/withdraw-investor-funds', async (request, reply) => {
    // authenticate request
    await fastify.authenticate(request, reply);
    const funds = request.body;
    const transaction = await withdrawInvestorFunds(funds);
    if (transaction) {
      reply.code(201).send({ transaction });
    } else {
      throw new Error('Insufficient funds for withdrawal');
      // reply.code(500).send({ error });
    }
  });

  fastify.post('/debit-investor-funds', async (request, reply) => {
    // authenticate request
    await fastify.authenticate(request, reply);
    const funds = request.body;
    const transaction = await debitInvestorFunds(funds);
    reply.code(201).send({ transaction });
  });

  fastify.post('/get-investor-balance', async (request, reply) => {
    // authenticate request
    await fastify.authenticate(request, reply);
    const funds = request.body;
    const balance = await getInvestorFundBalance(funds.userId);
    reply.code(201).send({
      balance: balance,
      userId: funds.userId,
    });
  });

  fastify.post('/get-investor-wallet-transaction', async (request, reply) => {
    // authenticate request
    await fastify.authenticate(request, reply);
    const funds = request.body;
    const transaction = await getAllInvestorWalletHistory(funds.userId);
    reply.code(201).send({
      transaction,
    });
  });

  fastify.post(
    '/',
    { schema: { body: postRequestBody, response: postResponseBody } },
    async (request, reply) => {
      fastify.log.info('creating user');
      try {
        const userId = await createInvestorUser(request.body);
        fastify.log.info(`user created with ${userId}`);
        reply.code(201).send({ userId });
      } catch (error) {
        reply.code(400).send(error);
      }
    }
  );

  fastify.get('/get-market-hours', async (request, reply) => {
    // authenticate request
    // append user request.user
    await fastify.authenticate(request, reply);

    const marketHours = await getMarketHours();
    reply.code(200).send({ marketHours });
  });

  fastify.post('/save-market-hours', async (request, reply) => {
    // authenticate request
    // append user request.user
    await fastify.authenticate(request, reply);
    const mh = request.body;
    const marketHours = await saveMarketHours(mh);

    reply.code(200).send({ marketHours });
  });
};

module.exports = userRoute;
