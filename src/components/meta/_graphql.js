export const createLevel = /* GraphQL */ `
  mutation CreateLevel(
    $input: CreateLevelInput!
    $condition: ModelLevelConditionInput
  ) {
    createLevel(input: $input, condition: $condition) {
      id
      name
      num
    }
  }
`;
export const listLevels = /* GraphQL */ `
  query ListLevels($filter: ModelLevelFilterInput, $nextToken: String) {
    listLevels(filter: $filter, limit: 32, nextToken: $nextToken) {
      items {
        id
        name
        num
      }
      nextToken
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
      levels {
        nextToken
      }
      topics {
        nextToken
      }
      questions {
        nextToken
      }
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
      levels {
        items {
          id
          level {
            id
          }
        }
        nextToken
      }
      topics {
        nextToken
      }
      questions {
        nextToken
      }
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
      levels {
        nextToken
      }
      topics {
        nextToken
      }
      questions {
        nextToken
      }
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
        levels {
          items {
            id
            level {
              id
              name
              num
            }
          }
        }
      }
      nextToken
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
      }
      subject {
        id
        name
      }
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
      questions {
        nextToken
      }
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
      }
      subject {
        id
        name
      }
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
      }
      questions {
        nextToken
      }
    }
  }
`;
export const listQuestionTypes = /* GraphQL */ `
  query ListQuestionTypes(
    $filter: ModelQuestionTypeFilterInput
    $nextToken: String
  ) {
    listQuestionTypes(filter: $filter, limit: 128, nextToken: $nextToken) {
      items {
        id
        name
        subjectID
        subject {
          id
          name
          longName
        }
      }
      nextToken
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
      }
      questions {
        nextToken
      }
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
      }
      questions {
        nextToken
      }
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
      subject {
        id
        name
        longName
      }
      questions {
        nextToken
      }
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
      subject {
        id
        name
        longName
      }
      questions {
        nextToken
      }
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
      subject {
        id
        name
        longName
      }
      questions {
        nextToken
      }
    }
  }
`;
export const listTopics = /* GraphQL */ `
  query ListTopics($filter: ModelTopicFilterInput, $nextToken: String) {
    listTopics(filter: $filter, limit: 128, nextToken: $nextToken) {
      items {
        id
        name
        num
        subjectID
        subject {
          id
          name
          longName
        }
      }
      nextToken
    }
  }
`;

export const listSkillGroups = /* GraphQL */ `
  query ListSkillGroups(
    $filter: ModelSkillGroupFilterInput
    $nextToken: String
  ) {
    listSkillGroups(filter: $filter, limit: 128, nextToken: $nextToken) {
      items {
        id
        name
        subjectID
        subject {
          id
          name
          longName
        }
      }
      nextToken
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
      }
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
      }
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
      }
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
      }
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
      }
    }
  }
`;
export const listSkills = /* GraphQL */ `
  query ListSkills($filter: ModelSkillFilterInput, $nextToken: String) {
    listSkills(filter: $filter, limit: 128, nextToken: $nextToken) {
      items {
        id
        name
        skillGroupID
        skillGroup {
          id
          name
        }
      }
      nextToken
    }
  }
`;
export const listSubSkills = /* GraphQL */ `
  query ListSubSkills($filter: ModelSubSkillFilterInput, $nextToken: String) {
    listSubSkills(filter: $filter, limit: 256, nextToken: $nextToken) {
      items {
        id
        name
        skillID
        skill {
          id
          name
          skillGroupID
          skillGroup {
            id
            name
          }
        }
      }
      nextToken
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
        skillGroup {
          id
          name
        }
      }
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
        skillGroup {
          id
          name
        }
      }
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
      }
    }
  }
`;
