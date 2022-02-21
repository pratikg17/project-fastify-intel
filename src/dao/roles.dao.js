const dao = (fastify) => {
  const getAllRoles = () => fastify.db.query('select * from roles');

  return {
    getAllRoles,
  };
};

module.exports = dao;
