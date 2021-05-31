import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Header,
  Form,
  Segment,
  Table,
  List,
  Modal,
  Icon,
} from "semantic-ui-react";
import {
  ENGLISH_SUBJECT_ID,
  GRAMMAR_MCQ_TOPIC_ID,
  QT_GRAMMAR_MCQ_ID,
} from "./../_config";
import { API, graphqlOperation } from "aws-amplify";
import {
  getSubject,
  createEnglishMCQQuestion,
  listQuestionsByQuestionTypeAndLevel,
  updateQuestion,
  deleteQuestion,
} from "./_graphql";
import Previewer from "../Previewer";
import _ from "lodash";

const GrammarMCQ = () => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  const createManageMap = {
    create: <CreateGrammarMCQ subject={subject} />,
    manage: <ManageGrammarMCQ subject={subject} />,
  };
  const fetchSubject = async () => {
    const { data } = await API.graphql(
      graphqlOperation(getSubject, { id: ENGLISH_SUBJECT_ID })
    );
    setSubject(data.getSubject);
  };
  useEffect(() => {
    fetchSubject();
  }, []);

  const renderCreateManage = () => {
    return (
      <Container textAlign="center">
        <Button
          onClick={handleItemClick}
          name="create"
          toggle
          active={activeItem === "create"}
        >
          Create New Question
        </Button>
        <Button
          onClick={handleItemClick}
          name="manage"
          toggle
          active={activeItem === "manage"}
        >
          Manage Questions
        </Button>
      </Container>
    );
  };
  return (
    <>
      <Header>Grammar MCQ</Header>
      <Container>{renderCreateManage()}</Container>
      <Container>{createManageMap[activeItem]}</Container>
    </>
  );
};

export default GrammarMCQ;

const CreateGrammarMCQ = (props) => {
  const { subject } = props;
  const levelOptions = subject.levels.items
    .map((item) => {
      const { id, name, num } = item.level;
      return {
        key: id,
        value: id,
        text: name,
        num,
      };
    })
    .sort((a, b) => a.num - b.num);
  const [levelID, setLevelID] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [wo1, setWo1] = useState("");
  const [wo2, setWo2] = useState("");
  const [wo3, setWo3] = useState("");
  const [previewing, setPreviewing] = useState("");
  const [explanation, setExplanation] = useState("");

  const [newlyCreatedQuestion, setNewlyCreatedQuestion] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = {
      topicID: GRAMMAR_MCQ_TOPIC_ID,
      subjectID: ENGLISH_SUBJECT_ID,
      levelID,
      questionTypeID: QT_GRAMMAR_MCQ_ID,
      questionText,
      answer,
      wrongOptions: JSON.stringify({ wo1, wo2, wo3 }),
      marks: 1,
      expectedTime: 2,
      vetted: false,
      explanation,
    };
    try {
      const data = await API.graphql(
        graphqlOperation(createEnglishMCQQuestion, {
          input: {
            ...question,
          },
        })
      );
      setNewlyCreatedQuestion({ ...data.data.createQuestion });
    } catch (e) {
      console.error(e);
    }
  };

  const renderPreview = () => {
    const options = { answer, wo1, wo2, wo3 };
    const renderedOptions = _.shuffle(Object.keys(options)).map((key) => {
      return (
        <Container
          key={key}
          style={{ paddingTop: "5px", paddingBottom: "5px" }}
        >
          <Button fluid>{options[key]}</Button>
        </Container>
      );
    });
    const content = (
      <Container>
        <Header as="h3">Question #</Header>
        <Container textAlign="left">{questionText}</Container>
        <Container style={{ paddingTop: "15px" }}>{renderedOptions}</Container>
        <Container
          textAlign="center"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <Button.Group>
            <Button floated="left">Previous Question</Button>
            <Button floated="right">Next Question</Button>
          </Button.Group>
        </Container>
      </Container>
    );
    if (previewing === "iphone") {
      const contentx = () => {
        return <>{content}</>;
      };
      return <Previewer Component={contentx} />;
    }
  };

  const handleClearForm = () => {
    setLevelID("");
    setQuestionText("");
    setAnswer("");
    setWo1("");
    setWo2("");
    setWo3("");
    setExplanation("");
  };

  const renderQuestionForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Select
          placeholder="Select Level"
          options={levelOptions}
          value={levelID}
          onChange={(e, { value }) => setLevelID(value)}
        />

        <Form.Field>
          <label>Question Text</label>
          <Form.Input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Answer</label>
          <Form.Input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Wrong Option 1</label>
          <Form.Input
            type="text"
            value={wo1}
            onChange={(e) => setWo1(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Wrong Option 2</label>
          <Form.Input
            type="text"
            value={wo2}
            onChange={(e) => setWo2(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Wrong Option 3</label>
          <Form.Input
            type="text"
            value={wo3}
            onChange={(e) => setWo3(e.target.value)}
          />
        </Form.Field>
        <Form.Field>
          <label>Explanation</label>
          <Form.TextArea
            rows={5}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </Form.Field>
        <Button primary type="submit">
          Submit
        </Button>
        <Button secondary type="button" onClick={() => setPreviewing("iphone")}>
          Preview (iPhone X)
        </Button>
        <Button negative type="button" onClick={handleClearForm}>
          Clear Form
        </Button>
      </Form>
    );
  };

  const renderQuestionCreatedModal = () => {
    if (Object.keys(newlyCreatedQuestion).length > 0) {
      return (
        <Modal
          basic
          trigger=""
          size="small"
          open={Object.keys(newlyCreatedQuestion).length > 0}
          onClose={() => setNewlyCreatedQuestion({})}
        >
          <Header icon="check" content="Question Successfully Created" />
          <Modal.Content>
            <p>Question Text: {newlyCreatedQuestion.questionText}</p>
            <p>Answer: {newlyCreatedQuestion.answer}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              inverted
              type="button"
              onClick={() => setNewlyCreatedQuestion({})}
            >
              <Icon name="thumbs up outline" /> Got it!
            </Button>
          </Modal.Actions>
        </Modal>
      );
    }
  };

  return (
    <Container style={{ paddingTop: "30px" }}>
      {renderQuestionForm()}
      {renderPreview()}
      {renderQuestionCreatedModal()}
    </Container>
  );
};

const ManageGrammarMCQ = (props) => {
  const { subject } = props;
  const levelOptions = subject.levels.items
    .map((item) => {
      const { id, name, num } = item.level;
      return {
        key: id,
        value: id,
        text: name,
        num,
      };
    })
    .sort((a, b) => a.num - b.num);
  const [levelID, setLevelID] = useState("");
  const renderSelectLevel = () => {
    return (
      <Form>
        <Form.Select
          fluid
          placeholder="Select Level"
          options={levelOptions}
          value={levelID}
          onChange={(e, { value }) => setLevelID(value)}
        />
      </Form>
    );
  };
  const [questionList, setQuestionList] = useState([]);
  const fetchQuestions = async (levelID) => {
    try {
      const data = await API.graphql(
        graphqlOperation(listQuestionsByQuestionTypeAndLevel, {
          questionTypeID: QT_GRAMMAR_MCQ_ID,
          levelID: { eq: levelID },
        })
      );
      const fetchedData = data.data.listQuestionsByQuestionTypeAndLevel.items;
      const sortedData = fetchedData.sort((a, b) =>
        a.questionText.localeCompare(b.questionText)
      );
      console.log(sortedData);
      setQuestionList(sortedData);
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (levelID.length > 0) {
      fetchQuestions(levelID);
    }
  }, [levelID]);

  const [isEditModalOpen, setIsEditModalOpen] = useState("");
  const handleEditModalClose = () => {
    setIsEditModalOpen("");
  };
  const handleEditModalOpen = (id) => {
    setIsEditModalOpen(id);
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState("");
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen("");
  };
  const handleDeleteModalOpen = (id) => {
    setIsDeleteModalOpen(id);
  };
  const [newlyDeletedQuestion, setNewlyDeletedQuestion] = useState({});
  const renderQuestionDeletedModal = () => {
    if (Object.keys(newlyDeletedQuestion).length > 0) {
      return (
        <Modal
          basic
          trigger=""
          size="small"
          open={Object.keys(newlyDeletedQuestion).length > 0}
          onClose={() => newlyDeletedQuestion({})}
        >
          <Header icon="check" content="Question Successfully Deleted" />
          <Modal.Content>
            <p>Question Text: {newlyDeletedQuestion.questionText}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="green"
              inverted
              type="button"
              onClick={() => setNewlyDeletedQuestion({})}
            >
              <Icon name="thumbs up outline" /> Got it!
            </Button>
          </Modal.Actions>
        </Modal>
      );
    }
  };
  const renderQuestion = (question) => {
    const { id, questionText, answer } = question;
    const wrongOptions = JSON.parse(question.wrongOptions);
    const renderedWOs = Object.keys(wrongOptions).map((wo) => {
      return <List.Item key={wo}>{wrongOptions[wo]}</List.Item>;
    });
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{questionText}</Table.Cell>
        <Table.Cell>{answer}</Table.Cell>
        <Table.Cell>
          <List bulleted>{renderedWOs}</List>
        </Table.Cell>
        <Table.Cell>
          <Button.Group>
            <EditQuestionModal
              question={question}
              levelOptions={levelOptions}
              handleEditModalClose={handleEditModalClose}
              handleEditModalOpen={handleEditModalOpen}
              fetchQuestions={fetchQuestions}
              isEditModalOpen={isEditModalOpen}
              setLevelID={setLevelID}
            />
            <DeleteQuestionModal
              question={question}
              handleDeleteModalClose={handleDeleteModalClose}
              handleDeleteModalOpen={handleDeleteModalOpen}
              fetchQuestions={fetchQuestions}
              isDeleteModalOpen={isDeleteModalOpen}
              setNewlyDeletedQuestion={setNewlyDeletedQuestion}
            />
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderQuestions = () => {
    if (questionList.length > 0) {
      const questionsBody = questionList.map((question) => {
        return renderQuestion(question);
      });
      return (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Cell width={3}>ID</Table.Cell>
              <Table.Cell>Question Text</Table.Cell>
              <Table.Cell>Answer</Table.Cell>
              <Table.Cell>Other Options</Table.Cell>
              <Table.Cell>Actions</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{questionsBody}</Table.Body>
        </Table>
      );
    }
  };

  return (
    <Container style={{ paddingTop: "30px" }}>
      {renderSelectLevel()}
      {renderQuestions()}
      {renderQuestionDeletedModal()}
    </Container>
  );
};

const EditQuestionModal = (props) => {
  const {
    question,
    levelOptions,
    handleEditModalClose,
    handleEditModalOpen,
    fetchQuestions,
    isEditModalOpen,
    setLevelID,
  } = props;
  const {
    id,
    levelID,
    subjectID,
    topicID,
    questionText,
    answer,
    questionTypeID,
    wrongOptions: rawWOs,
    explanation,
  } = question;
  const INITIAL_QUESTION = {
    id,
    levelID,
    subjectID,
    topicID,
    questionTypeID,
    questionText,
    answer,
    wrongOptions: rawWOs,
    explanation,
  };
  const wrongOptions = JSON.parse(rawWOs);
  const [newLevelID, setNewLevelID] = useState(levelID);
  const renderSelectLevel = () => {
    return (
      <Form.Select
        label="Select Level:"
        inline
        placeholder="Select Level"
        options={levelOptions}
        value={newLevelID}
        onChange={(e, { value }) => setNewLevelID(value)}
      />
    );
  };

  const [newQuestionText, setNewQuestionText] = useState(questionText);
  const renderQuestionTextInput = () => {
    return (
      <Form.Field>
        <Form.Input
          label="Question Text"
          value={newQuestionText}
          type="text"
          onChange={(e) => setNewQuestionText(e.target.value)}
        />
      </Form.Field>
    );
  };

  const [newAnswer, setNewAnswer] = useState(answer);
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

  const [wo1, setWo1] = useState(wrongOptions["wo1"]);
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

  const [wo2, setWo2] = useState(wrongOptions["wo2"]);
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

  const [wo3, setWo3] = useState(wrongOptions["wo3"]);
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
  const [newExplanation, setNewExplanation] = useState(explanation);
  const renderExplanationInput = () => {
    return (
      <Form.Field>
        <Form.TextArea
          label="Explanation"
          rows={5}
          value={newExplanation}
          onChange={(e) => setNewExplanation(e.target.value)}
        />
      </Form.Field>
    );
  };

  const handleEditSubmit = async () => {
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      subjectID,
      topicID,
      questionTypeID,
      questionText: newQuestionText,
      answer: newAnswer,
      wrongOptions: JSON.stringify({ wo1, wo2, wo3 }),
      explanation: newExplanation,
    };
    if (_.isEqual(updatedQuestion, INITIAL_QUESTION)) {
      return;
    }
    try {
      await API.graphql(
        graphqlOperation(updateQuestion, {
          input: {
            ...updatedQuestion,
          },
        })
      );
      setLevelID(newLevelID);
      fetchQuestions(newLevelID);
      handleEditModalClose();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Modal
      trigger={
        <Button type="button" primary onClick={() => handleEditModalOpen(id)}>
          <Icon name="edit" />
          Edit
        </Button>
      }
      open={isEditModalOpen === id}
      onClose={handleEditModalClose}
      centered={false}
    >
      <Header>Edit Question</Header>
      <Modal.Content>
        <Form onSubmit={handleEditSubmit}>
          {renderSelectLevel()}
          {renderQuestionTextInput()}
          {renderAnswerInput()}
          {renderWO1Input()}
          {renderWO2Input()}
          {renderWO3Input()}
          {renderExplanationInput()}
          <Button.Group fluid>
            <Button type="submit" positive>
              <Icon name="checkmark" />
              Submit
            </Button>
            <Button type="button" onClick={handleEditModalClose} negative>
              <Icon name="cancel" /> Cancel
            </Button>
          </Button.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

const DeleteQuestionModal = (props) => {
  const {
    question,
    handleDeleteModalClose,
    handleDeleteModalOpen,
    fetchQuestions,
    isDeleteModalOpen,
    setNewlyDeletedQuestion,
  } = props;
  const { id, questionText, answer } = question;
  const wrongOptions = JSON.parse(question.wrongOptions);
  const renderedOptions = Object.keys(wrongOptions).map((key) => {
    return <List.Item key={key}>{wrongOptions[key]}</List.Item>;
  });

  const handleDeleteQuestion = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteQuestion, { input: { id } })
      );
      console.log("deleted data", data);
      setNewlyDeletedQuestion({ ...data.deleteQuestion });
      fetchQuestions(data.deleteQuestion.levelID);
      handleDeleteModalClose();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <Modal
        trigger={
          <Button
            type="button"
            negative
            onClick={() => handleDeleteModalOpen(id)}
          >
            <Icon name="delete" />
            Delete
          </Button>
        }
        open={isDeleteModalOpen === id}
        onClose={handleDeleteModalClose}
        centered={false}
      >
        <Header>Are you sure you want to delete this question?</Header>
        <Modal.Content>
          <Segment>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.Cell>ID</Table.Cell>
                  <Table.Cell>{id}</Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Question Text</Table.Cell>
                  <Table.Cell>{questionText}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Answer</Table.Cell>
                  <Table.Cell>{answer}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Other Options</Table.Cell>
                  <Table.Cell>
                    <List bulleted>{renderedOptions}</List>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button.Group fluid>
            <Button negative type="button" onClick={handleDeleteQuestion}>
              <Icon name="delete" />
              Delete
            </Button>
            <Button secondary type="button" onClick={handleDeleteModalClose}>
              <Icon name="cancel" />
              Cancel
            </Button>
          </Button.Group>
        </Modal.Actions>
      </Modal>
    </>
  );
};
