import React, { useState, useEffect, Fragment } from "react";
import {
  Container,
  Button,
  Header,
  Form,
  Modal,
  Icon,
  Table,
  Segment,
  Divider,
  Input,
} from "semantic-ui-react";
import {
  ENGLISH_SUBJECT_ID,
  QT_COMPREHENSION_CLOZE_ID,
  COMPREHENSION_CLOZE_TOPIC_ID,
} from "./../_config";
import { API, graphqlOperation } from "aws-amplify";
import {
  getSubject,
  updateQuestion,
  deleteQuestion,
  listQuestionsByQuestionTypeAndLevel,
  createGrammarClozeQuestion,
} from "./_graphql";
import Previewer from "../Previewer";
import _ from "lodash";

const ComprehensionCloze = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateComprehensionCloze subject={subject} />,
    manage: <ManageComprehensionCloze subject={subject} />,
  };

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
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
      <Container
        textAlign="center"
        style={{ margin: "10px", paddingBottom: "10px" }}
      >
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
    <Container>
      <Header>Comprehension Cloze</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default ComprehensionCloze;

const CreateComprehensionCloze = (props) => {
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
      <Container style={{ border: "1px solid #cccccc", padding: "10px" }}>
        <Form.Select
          label="Level"
          placeholder="Select Level"
          options={levelOptions}
          value={levelID}
          onChange={(e, { value }) => setLevelID(value)}
        />
      </Container>
    );
  };

  const [passage, setPassage] = useState("");
  const renderPassageInput = () => {
    const label = (
      <Fragment>
        <Header as="h4">Comprehension Cloze Passage Text</Header>
        Enter the passage text below. Please denote each blank with exactly five
        (5) underscores ("_"). E.g. "She had been burning the midnight oil
        almost every night _____ the past two weeks."
      </Fragment>
    );
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Form.TextArea
          label={label}
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          style={{ minHeight: 300 }}
        />
      </Container>
    );
  };

  const renderSingleInput = (label, data, setData) => {
    return (
      <Form.Input
        key={label}
        type="text"
        label={label}
        value={data[label]}
        onChange={(e) => setData({ ...data, [label]: e.target.value })}
      />
    );
  };

  const DEFAULT_ANSWERS = {
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": "",
    "7": "",
    "8": "",
    "9": "",
    "10": "",
    "11": "",
    "12": "",
    "13": "",
    "14": "",
    "15": "",
  };
  const [answers, setAnswers] = useState({ ...DEFAULT_ANSWERS });
  const renderAnswerInputs = () => {
    const r = Object.keys(answers).map((label) => {
      return renderSingleInput(label, answers, setAnswers);
    });
    const [setA, setB, setC] = [r.slice(0, 5), r.slice(5, 10), r.slice(10)];
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Header as="h4">Answers</Header>
        <Form.Group>{setA}</Form.Group>
        <Form.Group>{setB}</Form.Group>
        <Form.Group>{setC}</Form.Group>
      </Container>
    );
  };

  const splitNewLines = passage.replace(
    /\n/g,
    "_____[[newLine]]_____[[afterNewLine]]"
  );
  const hardTextArray = splitNewLines.split(/_____/);
  const withInputs = hardTextArray.map((subString, i) => {
    if (i === 0) {
      return <Fragment key={i}>{subString}</Fragment>;
    } else if (subString === "[[newLine]]") {
      return (
        <Fragment key={i}>
          <Divider hidden />
        </Fragment>
      );
    } else {
      if (subString.startsWith("[[afterNewLine]]")) {
        return <Fragment key={i}>{subString.slice(16)}</Fragment>;
      } else {
        return (
          <Fragment key={i}>
            <Input type="text" />
            {subString}
          </Fragment>
        );
      }
    }
  });
  const [previewing, setPreviewing] = useState(false);
  const renderPreview = () => {
    const Content = (props) => {
      const instructions = (
        <Container
          style={{
            lineHeight: "100%",
            padding: "10px",
          }}
        >
          <Header as="h3">Comprehension Cloze</Header>
          Fill in each blank with a suitable word.
        </Container>
      );

      return (
        <Container textAlign="justified">
          {instructions}
          <Container
            style={{
              marginTop: "15px",
              padding: "5px",
              lineHeight: "250%",
              overflow: "scroll",
            }}
          >
            {withInputs}
          </Container>

          <Button positive fluid type="button">
            Submit
          </Button>
        </Container>
      );
    };

    if (previewing) {
      return <Previewer Component={Content} />;
    }
  };

  const [newlyCreatedQuestion, setNewlyCreatedQuestion] = useState({});
  const renderQuestionCreatedModal = () => {
    if (Object.keys(newlyCreatedQuestion).length > 0) {
      return (
        <Modal
          basic
          trigger=""
          size="small"
          open={Object.keys(newlyCreatedQuestion).length > 0}
          onClose={() => newlyCreatedQuestion({})}
        >
          <Header
            icon="check"
            content="Comprehension Cloze Question Successfully Created"
          />
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = {
      topicID: COMPREHENSION_CLOZE_TOPIC_ID,
      questionTypeID: QT_COMPREHENSION_CLOZE_ID,
      subjectID: ENGLISH_SUBJECT_ID,
      levelID,
      isMultiPart: true,
      marksPerSubQn: 1,
      expectedTime: 15,
      marks: 15,
      questionText: passage,
      answer: JSON.stringify(answers),
      vetted: false,
    };
    try {
      const data = await API.graphql(
        graphqlOperation(createGrammarClozeQuestion, {
          input: {
            ...question,
          },
        })
      );
      setNewlyCreatedQuestion({ ...data.data.createQuestion });
    } catch (e) {}
  };

  const handleClearForm = () => {
    setLevelID("");
    setPassage("");
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderPassageInput()}
        {renderAnswerInputs()}
        {renderPreview()}
        {renderQuestionCreatedModal()}
        <Container
          style={{
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <Button primary type="submit">
            Submit
          </Button>
          <Button
            secondary
            type="button"
            onClick={() => setPreviewing(!previewing)}
          >
            Preview (iPhone X)
          </Button>
          <Button negative type="button" onClick={handleClearForm}>
            Clear Form
          </Button>
        </Container>
      </Form>
    );
  };
  return <Container>{renderForm()}</Container>;
};

const ManageComprehensionCloze = (props) => {
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
      <Container style={{ border: "1px solid #CCC", padding: "10px" }}>
        <Form>
          <Form.Select
            fluid
            label="Level"
            placeholder="Select Level"
            options={levelOptions}
            value={levelID}
            onChange={(e, { value }) => setLevelID(value)}
          />
        </Form>
      </Container>
    );
  };

  const [questionList, setQuestionList] = useState([]);
  const fetchQuestions = async (levelID) => {
    try {
      const data = await API.graphql(
        graphqlOperation(listQuestionsByQuestionTypeAndLevel, {
          questionTypeID: QT_COMPREHENSION_CLOZE_ID,
          levelID: { eq: levelID },
        })
      );
      setQuestionList(data.data.listQuestionsByQuestionTypeAndLevel.items);
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
            <Segment inverted>
              Comprehension Cloze Text:{" "}
              {newlyDeletedQuestion.questionText.passage}
            </Segment>
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
    const { id, questionText: passage } = question;
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{passage}</Table.Cell>
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
              <Table.HeaderCell width={3}>ID</Table.HeaderCell>
              <Table.HeaderCell width={10}>Cloze Passage Text</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{questionsBody}</Table.Body>
        </Table>
      );
    }
  };
  return (
    <Container>
      {renderSelectLevel()}
      {renderQuestions()}
      {renderQuestionDeletedModal()}
    </Container>
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
  const { id, questionText } = question;

  const handleDeleteQuestion = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteQuestion, { input: { id } })
      );
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
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>{id}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Cloze Passage Text</Table.Cell>
                  <Table.Cell>{questionText.passage}</Table.Cell>
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
  const { id, levelID, questionText: passage, answer: rawAnswer } = question;
  const initial_question = {
    id,
    levelID,
    questionText: passage,
    answer: rawAnswer,
  };
  const answer = JSON.parse(rawAnswer);
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
  const [newPassage, setNewPassage] = useState(passage);
  const renderQuestionTextEditor = () => {
    const label = (
      <Fragment>
        <Header as="h4">Comprehension Cloze Passage Text</Header>
        Enter the passage text below. Please denote each blank with exactly five
        (5) underscores ("_"). E.g. "She had been burning the midnight oil
        almost every night _____ the past two weeks."
      </Fragment>
    );
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Form.TextArea
          label={label}
          value={newPassage}
          onChange={(e) => setNewPassage(e.target.value)}
          style={{ minHeight: 300 }}
        />
      </Container>
    );
  };

  const renderSingleInput = (label, data, setData) => {
    return (
      <Form.Input
        key={label}
        type="text"
        label={label}
        value={data[label]}
        onChange={(e) => setData({ ...data, [label]: e.target.value })}
      />
    );
  };

  const [newAnswers, setNewAnswers] = useState(answer);
  const renderNewAnswerInputs = () => {
    const r = Object.keys(newAnswers).map((label) => {
      return renderSingleInput(label, newAnswers, setNewAnswers);
    });
    const [setA, setB, setC] = [r.slice(0, 5), r.slice(5, 10), r.slice(10)];
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Header as="h4">Answers</Header>
        <Form.Group>{setA}</Form.Group>
        <Form.Group>{setB}</Form.Group>
        <Form.Group>{setC}</Form.Group>
      </Container>
    );
  };

  const handleEditSubmit = async () => {
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      questionText: newPassage,
      answer: JSON.stringify(newAnswers),
    };
    if (_.isEqual(updatedQuestion, initial_question)) {
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
      size="large"
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
          {renderQuestionTextEditor()}
          {renderNewAnswerInputs()}
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
