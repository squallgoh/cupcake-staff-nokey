/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateLevel = /* GraphQL */ `
  subscription OnCreateLevel {
    onCreateLevel {
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
export const onUpdateLevel = /* GraphQL */ `
  subscription OnUpdateLevel {
    onUpdateLevel {
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
export const onDeleteLevel = /* GraphQL */ `
  subscription OnDeleteLevel {
    onDeleteLevel {
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
export const onCreateLevelSubject = /* GraphQL */ `
  subscription OnCreateLevelSubject {
    onCreateLevelSubject {
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
export const onUpdateLevelSubject = /* GraphQL */ `
  subscription OnUpdateLevelSubject {
    onUpdateLevelSubject {
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
export const onDeleteLevelSubject = /* GraphQL */ `
  subscription OnDeleteLevelSubject {
    onDeleteLevelSubject {
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
export const onCreateSubject = /* GraphQL */ `
  subscription OnCreateSubject {
    onCreateSubject {
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
export const onUpdateSubject = /* GraphQL */ `
  subscription OnUpdateSubject {
    onUpdateSubject {
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
export const onDeleteSubject = /* GraphQL */ `
  subscription OnDeleteSubject {
    onDeleteSubject {
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
export const onCreateTopic = /* GraphQL */ `
  subscription OnCreateTopic {
    onCreateTopic {
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
export const onUpdateTopic = /* GraphQL */ `
  subscription OnUpdateTopic {
    onUpdateTopic {
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
export const onDeleteTopic = /* GraphQL */ `
  subscription OnDeleteTopic {
    onDeleteTopic {
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
export const onCreateQuestionType = /* GraphQL */ `
  subscription OnCreateQuestionType {
    onCreateQuestionType {
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
export const onUpdateQuestionType = /* GraphQL */ `
  subscription OnUpdateQuestionType {
    onUpdateQuestionType {
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
export const onDeleteQuestionType = /* GraphQL */ `
  subscription OnDeleteQuestionType {
    onDeleteQuestionType {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion($owner: String) {
    onCreateQuestion(owner: $owner) {
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
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion($owner: String) {
    onUpdateQuestion(owner: $owner) {
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
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion($owner: String) {
    onDeleteQuestion(owner: $owner) {
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
export const onCreateSkillGroup = /* GraphQL */ `
  subscription OnCreateSkillGroup {
    onCreateSkillGroup {
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
export const onUpdateSkillGroup = /* GraphQL */ `
  subscription OnUpdateSkillGroup {
    onUpdateSkillGroup {
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
export const onDeleteSkillGroup = /* GraphQL */ `
  subscription OnDeleteSkillGroup {
    onDeleteSkillGroup {
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
export const onCreateSkill = /* GraphQL */ `
  subscription OnCreateSkill {
    onCreateSkill {
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
export const onUpdateSkill = /* GraphQL */ `
  subscription OnUpdateSkill {
    onUpdateSkill {
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
export const onDeleteSkill = /* GraphQL */ `
  subscription OnDeleteSkill {
    onDeleteSkill {
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
export const onCreateSubSkill = /* GraphQL */ `
  subscription OnCreateSubSkill {
    onCreateSubSkill {
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
export const onUpdateSubSkill = /* GraphQL */ `
  subscription OnUpdateSubSkill {
    onUpdateSubSkill {
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
export const onDeleteSubSkill = /* GraphQL */ `
  subscription OnDeleteSubSkill {
    onDeleteSubSkill {
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
