module.exports = {
  Query: {
    me: async (_, incomingData, context) => {
      const { userId } = context;
      const userDetails = await context.userModel.getUserDetails(userId);
      return userDetails;
    },
    login: async (_, incomingData, context) => {
      const { email, password } = incomingData;
      const token = await context.userModel.authenticateUser(email, password);
      return { token };
    }
  },
  Mutation: {
    registerUser: async (_, incomingData, context) => {
      const { name, email, password, company } = incomingData;
      const token = await context.userModel.registerUser({
        name,
        email,
        password,
        company
      });
      return { token: token };
    },
    deleteUser: async (_, incomingData, context) => {
      const { userId } = context;
      const user = await context.userModel.deleteUser(userId);
      return user;
    }
  }
};
