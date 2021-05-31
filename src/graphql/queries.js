/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLevel = /* GraphQL */ `
  query GetLevel($id: ID!) {
    getLevel(id: $id) {
      id
      name
      num
      subjects {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listLevels = /* GraphQL */ `
  query ListLevels(
    $filter: ModelLevelFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLevels(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        num
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
      longName
      levels {
        nextToken
      }
      topics {
        nextToken
      }
      skillGroups {
        nextToken
      }
      questionTypes {
        nextToken
      }
      questions {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTopic = /* GraphQL */ `
  query GetTopic($id: ID!) {
    getTopic(id: $id) {
      id
      name
      subjectID
      num
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      questions {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTopics = /* GraphQL */ `
  query ListTopics(
    $filter: ModelTopicFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTopics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        subjectID
        num
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestionType = /* GraphQL */ `
  query GetQuestionType($id: ID!) {
    getQuestionType(id: $id) {
      id
      name
      subjectID
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      questions {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listQuestionTypes = /* GraphQL */ `
  query ListQuestionTypes(
    $filter: ModelQuestionTypeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        subjectID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      topicID
      topic {
        id
        name
        subjectID
        num
        createdAt
        updatedAt
      }
      subSkillID
      subSkill {
        id
        name
        skillID
        createdAt
        updatedAt
      }
      subjectID
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      levelID
      level {
        id
        name
        num
        createdAt
        updatedAt
      }
      questionTypeID
      questionType {
        id
        name
        subjectID
        createdAt
        updatedAt
      }
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
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getSkillGroup = /* GraphQL */ `
  query GetSkillGroup($id: ID!) {
    getSkillGroup(id: $id) {
      id
      name
      subjectID
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      skills {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSkillGroups = /* GraphQL */ `
  query ListSkillGroups(
    $filter: ModelSkillGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSkillGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        subjectID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSkill = /* GraphQL */ `
  query GetSkill($id: ID!) {
    getSkill(id: $id) {
      id
      name
      skillGroupID
      skillGroup {
        id
        name
        subjectID
        createdAt
        updatedAt
      }
      subSkills {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSkills = /* GraphQL */ `
  query ListSkills(
    $filter: ModelSkillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        skillGroupID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getSubSkill = /* GraphQL */ `
  query GetSubSkill($id: ID!) {
    getSubSkill(id: $id) {
      id
      name
      skillID
      skill {
        id
        name
        skillGroupID
        createdAt
        updatedAt
      }
      questions {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listSubSkills = /* GraphQL */ `
  query ListSubSkills(
    $filter: ModelSubSkillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubSkills(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        skillID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listQuestionsByTopicAndQuestionType = /* GraphQL */ `
  query ListQuestionsByTopicAndQuestionType(
    $topicID: ID
    $questionTypeID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionsByTopicAndQuestionType(
      topicID: $topicID
      questionTypeID: $questionTypeID
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
export const listQuestionsByQuestionTypeAndLevel = /* GraphQL */ `
  query ListQuestionsByQuestionTypeAndLevel(
    $questionTypeID: ID
    $levelID: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestionsByQuestionTypeAndLevel(
      questionTypeID: $questionTypeID
      levelID: $levelID
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
export const listSubSkillBySkill = /* GraphQL */ `
  query ListSubSkillBySkill(
    $skillID: ID
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSubSkillFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSubSkillBySkill(
      skillID: $skillID
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        skillID
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
