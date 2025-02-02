import { ApolloServer, gql } from "apollo-server-express";
import { fetchFileList } from "./githubService.js";

const typeDefs = gql`
    type Query {
        listFiles(owner: String!, repo: String!, branch: String!): [String]
    }
`;

const resolvers = {
    Query: {
        listFiles: async (_, { owner, repo, branch }) => fetchFileList(owner, repo, branch),
    },
};

export function createApolloServer() {
    return new ApolloServer({ typeDefs, resolvers });
}