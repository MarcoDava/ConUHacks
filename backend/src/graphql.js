import { gql } from "apollo-server-express";
import { getBlameData } from "./githubService.js";

// GraphQL Schema
export const typeDefs = gql`
  type Commit {
    oid: String
    message: String
    author: Author
  }

  type Author {
    name: String
    email: String
    date: String
  }

  type BlameRange {
    commit: Commit
    startingLine: Int
    endingLine: Int
  }

  type Blame {
    ranges: [BlameRange]
  }

  type File {
    blame: Blame
    text: String
  }

  type Query {
    getFileBlame(owner: String!, repo: String!, branch: String!, filePath: String!): File
  }
`;

// Resolvers
export const resolvers = {
    Query: {
        getFileBlame: async (_, { owner, repo, branch, filePath }) => {
            try {
                return await getBlameData(owner, repo, branch, filePath);
            } catch (error) {
                console.error("Error in resolver:", error.message);
                throw new Error("Failed to retrieve blame data.");
            }
        },
    },
};