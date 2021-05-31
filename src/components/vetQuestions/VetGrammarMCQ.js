import React, { useState, useEffect } from "react";
import { Container, Button, Form, Icon, Header } from "semantic-ui-react";
import {
  listQuestionsByQuestionTypeAndLevel,
  getSubject,
  getSkillGroup,
  updateQuestion,
} from "./_graphql";
import { API, graphqlOperation } from "aws-amplify";
import {
  QT_GRAMMAR_MCQ_ID,
  ENGLISH_SUBJECT_ID,
} from "../questions/_config.json";
import { removeFigureTag, renderCKEditor } from "../../_common";

const VetGrammarMCQ = () => {
  const [questionsCache, setQuestionsCache] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(undefined);
  const [nextToken, setNextToken] = useState(undefined);
  const [subject, setSubject] = useState();
  const [subSkills, setSubSkills] = useState([]);

  useEffect(() => {
    // Fetch Subject
    const fetchSubject = async () => {
      const { data } = await API.graphql(
        graphqlOperation(getSubject, { id: ENGLISH_SUBJECT_ID })
      );
      setSubject(data.getSubject);
    };
    fetchSubject();
  }, []);
  useEffect(() => {
    // Fetch SubSkills
    const fetchSubSkills = async () => {
      try {
        const { data } = await API.graphql(
          graphqlOperation(getSkillGroup, {
            id: "30c4f96d-ba32-4926-89d2-4beccfb71e88",
          })
        );
        const grammarSkills = data.getSkillGroup.skills.items;
        const grammarSubSkills = grammarSkills.map((skill) => {
          return skill.subSkills.items.map((subSkill) => {
            const { id, name } = subSkill;
            return {
              key: id,
              value: id,
              text: `${skill.name}/${name}`,
            };
          });
        });
        setSubSkills(grammarSubSkills.flat());
      } catch (e) {
        console.error(e);
      }
    };
    fetchSubSkills();
  }, []);
  useEffect(() => {
    // Fetch questions from DB
    const fetchQuestions = async (initialToken) => {
      var fetchToken = initialToken;
      var qArray = [...questionsCache];
      while (qArray.length < 10) {
        try {
          const { data } = await API.graphql(
            graphqlOperation(listQuestionsByQuestionTypeAndLevel, {
              questionTypeID: QT_GRAMMAR_MCQ_ID,
              nextToken: fetchToken,
              filter: {
                vetted: {
                  ne: true,
                },
              },
            })
          );
          const fetchedData = data.listQuestionsByQuestionTypeAndLevel.items;
          const sortedData = fetchedData.sort((a, b) =>
            a.questionText.localeCompare(b.questionText)
          );
          qArray = [...qArray, ...sortedData];
          fetchToken = data.listQuestionsByQuestionTypeAndLevel.nextToken;
        } catch (e) {
          console.error(e);
        }
      }
      setQuestionsCache([...qArray]);
      setNextToken(fetchToken);
    };
    if (questionsCache.length < 10) {
      fetchQuestions(nextToken);
    }
  }, [nextToken, questionsCache]);
  useEffect(() => {
    if (questionsCache.length) {
      if (
        currentQuestion !== undefined &&
        currentQuestion.id === questionsCache[0].id
      ) {
        return; // do nothing
      } else {
        const cq = questionsCache[0];
        setCurrentQuestion(cq);
        setNewLevelID(cq.levelID);
        setNewQuestionText(cq.questionText);
        setNewAnswer(cq.answer);
        const wrongOptions = JSON.parse(cq.wrongOptions);
        setWo1(wrongOptions["wo1"]);
        setWo2(wrongOptions["wo2"]);
        setWo3(wrongOptions["wo3"]);
        const fetchedExplanation = cq.explanation ? cq.explanation : "";
        setNewExplanation(fetchedExplanation);
        const fetchedSubSkillID = cq.subSkill ? cq.subSkill.id : "";
        setNewSubSkillID(fetchedSubSkillID);
      }
    }
  }, [currentQuestion, questionsCache]);

  const handleNextClick = () => {
    const newQuestionsCache = questionsCache.slice(1);
    setQuestionsCache(newQuestionsCache);
  };

  const levelOptions =
    subject !== undefined
      ? subject.levels.items
          .map((item) => {
            const { id, name, num } = item.level;
            return {
              key: id,
              value: id,
              text: name,
              num,
            };
          })
          .sort((a, b) => a.num - b.num)
      : undefined;
  const [newLevelID, setNewLevelID] = useState("");
  const renderSelectLevel = () => {
    return (
      <Form.Field>
        <Form.Select
          fluid
          placeholder="Select Level"
          options={levelOptions}
          value={newLevelID}
          onChange={(e, { value }) => setNewLevelID(value)}
        />
      </Form.Field>
    );
  };

  const [newSubSkillID, setNewSubSkillID] = useState("");
  const renderSelectSubSkill = () => {
    return (
      <Form.Field>
        <Form.Select
          fluid
          placeholder="Select Sub-Skill"
          options={subSkills}
          value={newSubSkillID}
          onChange={(e, { value }) => setNewSubSkillID(value)}
        />
      </Form.Field>
    );
  };

  const [newQuestionText, setNewQuestionText] = useState("");
  const renderQuestionTextInput = () => {
    return (
      <Form.Field>
        <Form.TextArea
          label="Question Text"
          rows={3}
          value={newQuestionText}
          onChange={(e) => setNewQuestionText(e.target.value)}
        />
      </Form.Field>
    );
  };

  const [newAnswer, setNewAnswer] = useState("");
  const renderAnswerInput = () => {
    return (
      <Form.Field>
        <Form.Input
          label="Answer"
          value={newAnswer}
          type="text"
          onChange={(e) => setNewAnswer(e.target.value)}
        />
      </Form.Field>
    );
  };

  const [wo1, setWo1] = useState("");
  const renderWO1Input = () => {
    return (
      <Form.Field>
        <Form.Input
          label="Wrong Option 1"
          value={wo1}
          type="text"
          onChange={(e) => setWo1(e.target.value)}
        />
      </Form.Field>
    );
  };

  const [wo2, setWo2] = useState("");
  const renderWO2Input = () => {
    return (
      <Form.Field>
        <Form.Input
          label="Wrong Option 2"
          value={wo2}
          type="text"
          onChange={(e) => setWo2(e.target.value)}
        />
      </Form.Field>
    );
  };

  const [wo3, setWo3] = useState("");
  const renderWO3Input = () => {
    return (
      <Form.Field>
        <Form.Input
          label="Wrong Option 3"
          value={wo3}
          type="text"
          onChange={(e) => setWo3(e.target.value)}
        />
      </Form.Field>
    );
  };

  const [newExplanation, setNewExplanation] = useState("");
  const renderExplanationEditor = () => {
    if (currentQuestion) {
      const namePrefix = `grammarMCQ/${currentQuestion.id}/explanation-`;
      const label = "Explanation";
      return renderCKEditor(
        label,
        newExplanation,
        setNewExplanation,
        namePrefix
      );
    }
  };

  const renderEditor = () => {
    if (subject !== undefined && questionsCache.length) {
      return (
        <Container>
          <Header>Vet Grammar MCQs</Header>
          <Form onSubmit={handleVettingSubmit}>
            {renderSelectLevel()}
            {renderSelectSubSkill()}
            {renderQuestionTextInput()}
            {renderAnswerInput()}
            {renderWO1Input()}
            {renderWO2Input()}
            {renderWO3Input()}
            {renderExplanationEditor()}
            <Button type="submit" positive>
              <Icon name="checkmark" />
              Submit
            </Button>
            <Button type="button" secondary onClick={handleNextClick}>
              Next Question
              <Icon name="arrow right" />
            </Button>
          </Form>
        </Container>
      );
    }
  };

  const handleVettingSubmit = async () => {
    const { id, subjectID, topicID, questionTypeID } = currentQuestion;
    const updatedQuestion = {
      id,
      subjectID,
      topicID,
      questionTypeID,
      levelID: newLevelID,
      questionText: newQuestionText,
      answer: newAnswer,
      wrongOptions: JSON.stringify({ wo1, wo2, wo3 }),
      explanation: removeFigureTag(newExplanation),
      subSkillID: newSubSkillID,
      vetted: true,
    };
    try {
      await API.graphql(
        graphqlOperation(updateQuestion, {
          input: {
            ...updatedQuestion,
          },
        })
      );
      const newQuestionsCache = questionsCache.slice(1);
      setQuestionsCache(newQuestionsCache);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container>
      <Container style={{ paddingTop: "30px" }}>{renderEditor()}</Container>
    </Container>
  );
};

export default VetGrammarMCQ;
