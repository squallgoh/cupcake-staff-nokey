export const listSubjects = /* GraphQL */ `
  query ListSubjects(
    $filter: ModelSubjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        longName
      }
      nextToken
    }
  }
`;
export const listQuestionTypesBySubject = /* GraphQL */ `
  query GetSubject($id: ID!) {
    getSubject(id: $id) {
      id
      name
      longName
      questionTypes(limit: 128) {
        items {
          id
          name
        }
        nextToken
      }
    }
  }
`;
