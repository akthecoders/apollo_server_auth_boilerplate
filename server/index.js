const connectDB = require('./config/db');
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const UserModel = require('./models/User');

const userObj = new UserModel();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.token || '';
    const userId = userObj.getUserViaToken(token);
    return {
      userId,
      userModel: new UserModel()
    };
  }
});

// Connect MongoDB
connectDB();

// Start the Server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
