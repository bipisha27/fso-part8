require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const connectToDatabase = require("./db");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

const MONGODB_URI = process.env.MONGODB_URI;

const main = async () => {
  await connectToDatabase(MONGODB_URI);

  const server = new ApolloServer({ typeDefs, resolvers });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },

    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null;

      if (auth && auth.startsWith("Bearer")) {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET,
        );

        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      }

      return { currentUser: null };
    },
  });

  console.log(`Server ready at ${url}`);
};

main();
