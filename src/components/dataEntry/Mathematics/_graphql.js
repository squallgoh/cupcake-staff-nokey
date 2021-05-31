export const getSubject = /* GraphQL */ `
  query GetSubject($id: ID!) {
    getSubject(id: $id) {
      id
      name
      levels {
        items {
          level {
            id
            name
            num
          }
        }
      }
      topics(limit: 128) {
        items {
          id
          name
          num
        }
      }
    }
  }
`;
export const listQuestionsByTopicByQuestionTypeByLevel = /* GraphQL */ `
  query ListQuestionsByTopicByQuestionTypeByLevel(
    $topicID: ID
    $questionTypeIDLevelID: ModelQuestionByTopicByQuestionTypeByLevelCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionsByTopicByQuestionTypeByLevel(
      topicID: $topicID
      questionTypeIDLevelID: $questionTypeIDLevelID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        topicID
        subjectID
        levelID
        questionTypeID
        questionText
        answer
        wrongOptions
        marks
        expectedTime
        marksPerSubQn
        subQuestions
        isMultiPart
        answerClozeTexts
      }
      nextToken
    }
  }
`;
export const listQuestionsByQuestionTypeByCreatedAt = /* GraphQL */ `
  query ListQuestionsByQuestionTypeByCreatedAt(
    $questionTypeID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionsByQuestionTypeByCreatedAt(
      questionTypeID: $questionTypeID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        topicID
        subjectID
        levelID
        questionTypeID
        questionText
        answer
        wrongOptions
        marks
        expectedTime
        marksPerSubQn
        subQuestions
        isMultiPart
        answerClozeTexts
        vetted
        owner
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const createMathMCQQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      topic {
        id
        name
      }
      level {
        id
        name
      }
      questionText
      answer
      wrongOptions
      marks
      expectedTime
    }
  }
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
      id
      topicID
      subjectID
      level {
        id
        name
        num
      }
      questionTypeID
      questionText
      answer
      wrongOptions
      marks
      expectedTime
      isMultiPart
    }
  }
`;
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
      id
      levelID
      questionText
      topicID
    }
  }
`;
export const createMathShortAnswer = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      topic {
        id
        name
      }
      level {
        id
        name
      }
      questionText
      answer
      marks
      expectedTime
    }
  }
`;
