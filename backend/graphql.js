import { ApolloServer, gql } from "apollo-server-express";
import { fetchFileList, fetchAllUserCode } from "./githubService.js";

const typeDefs = gql`
    type Query {
        listFiles(owner: String!, repo: String!, branch: String!): [String]
        getAllUserCode(owner: String!, repo: String!, branch: String!, targetUser: String!): String
    }
`;

const resolvers = {
    Query: {
        listFiles: async (_, { owner, repo, branch }) => fetchFileList(owner, repo, branch),
        getAllUserCode: async (_, { owner, repo, branch, targetUser }) => fetchAllUserCode(owner, repo, branch, targetUser),
    },
};

export function createApolloServer() {
    return new ApolloServer({ typeDefs, resolvers });
}
