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
        }
      }
    }
  }
`;
export const createEnglishMCQQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      topic {
        id
        name
        subjectID
      }
      subject {
        id
        name
        longName
      }
      level {
        id
        name
        num
      }
      questionType {
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
export const listQuestionsByQuestionTypeAndLevel = /* GraphQL */ `
  query ListQuestionsByQuestionTypeAndLevel(
    $questionTypeID: ID
    $levelID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $nextToken: String
  ) {
    listQuestionsByQuestionTypeAndLevel(
      questionTypeID: $questionTypeID
      levelID: $levelID
      sortDirection: $sortDirection
      filter: $filter
      limit: 2048
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
        subQuestions
        explanation
      }
      nextToken
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
    }
  }
`;
export const createVocabClozeQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      level {
        id
        name
        num
      }
      questionText
      expectedTime
      marksPerSubQn
      subQuestions
      isMultiPart
    }
  }
`;
export const listVocabClozeQuestions = /* GraphQL */ `
  query ListQuestionsByQuestionTypeAndLevel(
    $questionTypeID: ID
    $levelID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $nextToken: String
  ) {
    listQuestionsByQuestionTypeAndLevel(
      questionTypeID: $questionTypeID
      levelID: $levelID
      sortDirection: $sortDirection
      filter: $filter
      limit: 1024
      nextToken: $nextToken
    ) {
      items {
        id
        levelID
        questionText
        subQuestions
        expectedTime
      }
      nextToken
    }
  }
`;
export const createVisualTextQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      level {
        id
        name
        num
      }
      questionText
      expectedTime
      marksPerSubQn
      subQuestions
      isMultiPart
    }
  }
`;
export const createGrammarClozeQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      level {
        id
        name
        num
      }
      questionText
      answer
      expectedTime
      marksPerSubQn
      isMultiPart
    }
  }
`;
