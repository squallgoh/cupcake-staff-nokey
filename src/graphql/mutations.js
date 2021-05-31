/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLevel = /* GraphQL */ `
  mutation CreateLevel(
    $input: CreateLevelInput!
    $condition: ModelLevelConditionInput
  ) {
    createLevel(input: $input, condition: $condition) {
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
export const updateLevel = /* GraphQL */ `
  mutation UpdateLevel(
    $input: UpdateLevelInput!
    $condition: ModelLevelConditionInput
  ) {
    updateLevel(input: $input, condition: $condition) {
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
export const deleteLevel = /* GraphQL */ `
  mutation DeleteLevel(
    $input: DeleteLevelInput!
    $condition: ModelLevelConditionInput
  ) {
    deleteLevel(input: $input, condition: $condition) {
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
export const createLevelSubject = /* GraphQL */ `
  mutation CreateLevelSubject(
    $input: CreateLevelSubjectInput!
    $condition: ModelLevelSubjectConditionInput
  ) {
    createLevelSubject(input: $input, condition: $condition) {
      id
      levelID
      subjectID
      level {
        id
        name
        num
        createdAt
        updatedAt
      }
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateLevelSubject = /* GraphQL */ `
  mutation UpdateLevelSubject(
    $input: UpdateLevelSubjectInput!
    $condition: ModelLevelSubjectConditionInput
  ) {
    updateLevelSubject(input: $input, condition: $condition) {
      id
      levelID
      subjectID
      level {
        id
        name
        num
        createdAt
        updatedAt
      }
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteLevelSubject = /* GraphQL */ `
  mutation DeleteLevelSubject(
    $input: DeleteLevelSubjectInput!
    $condition: ModelLevelSubjectConditionInput
  ) {
    deleteLevelSubject(input: $input, condition: $condition) {
      id
      levelID
      subjectID
      level {
        id
        name
        num
        createdAt
        updatedAt
      }
      subject {
        id
        name
        longName
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createSubject = /* GraphQL */ `
  mutation CreateSubject(
    $input: CreateSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    createSubject(input: $input, condition: $condition) {
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
export const updateSubject = /* GraphQL */ `
  mutation UpdateSubject(
    $input: UpdateSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    updateSubject(input: $input, condition: $condition) {
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
export const deleteSubject = /* GraphQL */ `
  mutation DeleteSubject(
    $input: DeleteSubjectInput!
    $condition: ModelSubjectConditionInput
  ) {
    deleteSubject(input: $input, condition: $condition) {
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
export const createTopic = /* GraphQL */ `
  mutation CreateTopic(
    $input: CreateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    createTopic(input: $input, condition: $condition) {
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
export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic(
    $input: UpdateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    updateTopic(input: $input, condition: $condition) {
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
export const deleteTopic = /* GraphQL */ `
  mutation DeleteTopic(
    $input: DeleteTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    deleteTopic(input: $input, condition: $condition) {
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
export const createQuestionType = /* GraphQL */ `
  mutation CreateQuestionType(
    $input: CreateQuestionTypeInput!
    $condition: ModelQuestionTypeConditionInput
  ) {
    createQuestionType(input: $input, condition: $condition) {
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
export const updateQuestionType = /* GraphQL */ `
  mutation UpdateQuestionType(
    $input: UpdateQuestionTypeInput!
    $condition: ModelQuestionTypeConditionInput
  ) {
    updateQuestionType(input: $input, condition: $condition) {
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
export const deleteQuestionType = /* GraphQL */ `
  mutation DeleteQuestionType(
    $input: DeleteQuestionTypeInput!
    $condition: ModelQuestionTypeConditionInput
  ) {
    deleteQuestionType(input: $input, condition: $condition) {
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
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
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
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
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
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
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
export const createSkillGroup = /* GraphQL */ `
  mutation CreateSkillGroup(
    $input: CreateSkillGroupInput!
    $condition: ModelSkillGroupConditionInput
  ) {
    createSkillGroup(input: $input, condition: $condition) {
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
export const updateSkillGroup = /* GraphQL */ `
  mutation UpdateSkillGroup(
    $input: UpdateSkillGroupInput!
    $condition: ModelSkillGroupConditionInput
  ) {
    updateSkillGroup(input: $input, condition: $condition) {
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
export const deleteSkillGroup = /* GraphQL */ `
  mutation DeleteSkillGroup(
    $input: DeleteSkillGroupInput!
    $condition: ModelSkillGroupConditionInput
  ) {
    deleteSkillGroup(input: $input, condition: $condition) {
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
export const createSkill = /* GraphQL */ `
  mutation CreateSkill(
    $input: CreateSkillInput!
    $condition: ModelSkillConditionInput
  ) {
    createSkill(input: $input, condition: $condition) {
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
export const updateSkill = /* GraphQL */ `
  mutation UpdateSkill(
    $input: UpdateSkillInput!
    $condition: ModelSkillConditionInput
  ) {
    updateSkill(input: $input, condition: $condition) {
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
export const deleteSkill = /* GraphQL */ `
  mutation DeleteSkill(
    $input: DeleteSkillInput!
    $condition: ModelSkillConditionInput
  ) {
    deleteSkill(input: $input, condition: $condition) {
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
export const createSubSkill = /* GraphQL */ `
  mutation CreateSubSkill(
    $input: CreateSubSkillInput!
    $condition: ModelSubSkillConditionInput
  ) {
    createSubSkill(input: $input, condition: $condition) {
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
export const updateSubSkill = /* GraphQL */ `
  mutation UpdateSubSkill(
    $input: UpdateSubSkillInput!
    $condition: ModelSubSkillConditionInput
  ) {
    updateSubSkill(input: $input, condition: $condition) {
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
export const deleteSubSkill = /* GraphQL */ `
  mutation DeleteSubSkill(
    $input: DeleteSubSkillInput!
    $condition: ModelSubSkillConditionInput
  ) {
    deleteSubSkill(input: $input, condition: $condition) {
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
