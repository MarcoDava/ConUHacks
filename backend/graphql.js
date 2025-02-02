import { ApolloServer, gql } from "apollo-server-express";
import dotenv from "dotenv";
import { fetchAllUserCode } from "./githubService.js";

dotenv.config();

// Define your GraphQL schema
const typeDefs = gql`
  type FileWithCode {
    filePath: String
    code: [String]
  }

  type Query {
    # Returns all code authored by a target user across all files in the repository
    getAllUserCode(owner: String!, repo: String!, branch: String!, targetUser: String!): [FileWithCode]
  }
`;

// Define your resolvers
const resolvers = {
  Query: {
    getAllUserCode: async (_, { owner, repo, branch, targetUser }) => {
      try {
        const codeData = await fetchAllUserCode(owner, repo, branch, targetUser);
        return Object.entries(codeData).map(([filePath, code]) => ({
          filePath,
          code,
        }));
      } catch (error) {
        console.error("Error in getAllUserCode resolver:", error.message);
        throw new Error("Failed to fetch all user code.");
      }
    },
  },
};

/**
 * Creates and returns an instance of ApolloServer.
 */
export async function createApolloServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  return server;
}
