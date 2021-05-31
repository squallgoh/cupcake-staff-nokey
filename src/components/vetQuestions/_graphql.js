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
      limit: 30
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
        subSkill {
          id
        }
        vetted
      }
      nextToken
    }
  }
`;
export const listQuestionsByQuestionTypeBySubSkillId = /* GraphQL */ `
  query ListQuestionsByQuestionTypeBySubSkillId(
    $questionTypeID: ID
    $subSkillID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionsByQuestionTypeBySubSkillID(
      questionTypeID: $questionTypeID
      subSkillID: $subSkillID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        topicID
        subSkillID
        subjectID
        levelID
        questionTypeID
        questionText
        answer
        explanation
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
export const getSkillGroup = /* GraphQL */ `
  query GetSkillGroup($id: ID!) {
    getSkillGroup(id: $id) {
      id
      name
      skills {
        items {
          id
          name
          subSkills {
            items {
              id
              name
            }
          }
        }
      }
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
      level {
        name
      }
      subSkill {
        name
      }
      questionText
      answer
      wrongOptions
      explanation
    }
  }
`;
