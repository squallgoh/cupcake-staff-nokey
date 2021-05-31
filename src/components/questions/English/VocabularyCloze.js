import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Header,
  Form,
  Modal,
  Icon,
  Table,
  Segment,
} from "semantic-ui-react";
import {
  ENGLISH_SUBJECT_ID,
  QT_VOCAB_CLOZE_ID,
  VOCAB_CLOZE_TOPIC_ID,
} from "./../_config";
import { API, graphqlOperation } from "aws-amplify";
import {
  getSubject,
  listVocabClozeQuestions,
  updateQuestion,
  deleteQuestion,
  createVocabClozeQuestion,
} from "./_graphql";
import Previewer from "../Previewer";
import _ from "lodash";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@squallgoh/ckeditor5-for-cupcake";
import ReactHtmlParser from "react-html-parser";

const VocabularyCloze = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateVocabCloze subject={subject} />,
    manage: <ManageVocabCloze subject={subject} />,
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
      <Header>Vocabulary Cloze</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default VocabularyCloze;

const CreateVocabCloze = (props) => {
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
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
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

  const questionText = useCKInput("");
  const renderQuestionTextEditor = () => {
    const namePrefix = "vocabularyCloze/";
    const questionTextLabel = "Cloze Passage Text";
    return renderCKEditor(questionTextLabel, questionText, namePrefix);
  };

  const DEFAULT_SUB_QN = {
    answer: "",
    wo1: "",
    wo2: "",
    wo3: "",
  };

  const [qn1, setQn1] = useState({ ...DEFAULT_SUB_QN });
  const renderSubQn1 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 1</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn1.answer}
              onChange={(e) => setQn1({ ...qn1, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn1.wo1}
              onChange={(e) => setQn1({ ...qn1, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn1.wo2}
              onChange={(e) => setQn1({ ...qn1, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn1.wo3}
              onChange={(e) => setQn1({ ...qn1, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn2, setQn2] = useState({ ...DEFAULT_SUB_QN });
  const renderSubQn2 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 2</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn2.answer}
              onChange={(e) => setQn2({ ...qn2, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn2.wo1}
              onChange={(e) => setQn2({ ...qn2, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn2.wo2}
              onChange={(e) => setQn2({ ...qn2, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn2.wo3}
              onChange={(e) => setQn2({ ...qn2, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn3, setQn3] = useState({ ...DEFAULT_SUB_QN });
  const renderSubQn3 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 3</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn3.answer}
              onChange={(e) => setQn3({ ...qn3, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn3.wo1}
              onChange={(e) => setQn3({ ...qn3, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn3.wo2}
              onChange={(e) => setQn3({ ...qn3, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn3.wo3}
              onChange={(e) => setQn3({ ...qn3, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn4, setQn4] = useState({ ...DEFAULT_SUB_QN });
  const renderSubQn4 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 4</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn4.answer}
              onChange={(e) => setQn4({ ...qn4, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn4.wo1}
              onChange={(e) => setQn4({ ...qn4, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn4.wo2}
              onChange={(e) => setQn4({ ...qn4, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn4.wo3}
              onChange={(e) => setQn4({ ...qn4, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn5, setQn5] = useState({ ...DEFAULT_SUB_QN });
  const renderSubQn5 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 5</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn5.answer}
              onChange={(e) => setQn5({ ...qn5, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn5.wo1}
              onChange={(e) => setQn5({ ...qn5, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn5.wo2}
              onChange={(e) => setQn5({ ...qn5, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn5.wo3}
              onChange={(e) => setQn5({ ...qn5, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const handleIntInput = (e, setValueFunction) => {
    const { value } = e.target;
    if (!value) {
      setValueFunction("");
    } else if (value > 0 && value < 21) {
      setValueFunction(parseInt(value));
    }
  };

  const [expectedTime, setExpectedTime] = useState("");
  const renderExpectedTimeInput = () => {
    return (
      <Container
        style={{
          border: "1px solid #E1E1E1",
          padding: "10px",
          marginTop: "10px",
        }}
      >
        <Form.Field>
          <Form.Input
            type="number"
            label="Expected Time to Complete Vocabulary Cloze (in minutes)"
            value={expectedTime}
            onChange={(e) => handleIntInput(e, setExpectedTime)}
          />
        </Form.Field>
      </Container>
    );
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
            content="Vocabulary Cloze Question Successfully Created"
          />
          <Modal.Content>
            <Segment inverted>
              Cloze Passage:{" "}
              {ReactHtmlParser(newlyCreatedQuestion.questionText)}
            </Segment>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const question = {
      topicID: VOCAB_CLOZE_TOPIC_ID,
      questionTypeID: QT_VOCAB_CLOZE_ID,
      subjectID: ENGLISH_SUBJECT_ID,
      levelID,
      questionText: questionText.data,
      expectedTime,
      subQuestions: JSON.stringify({
        subQn1: qn1,
        subQn2: qn2,
        subQn3: qn3,
        subQn4: qn4,
        subQn5: qn5,
      }),
      isMultiPart: true,
      marksPerSubQn: 1,
      vetted: false,
    };
    try {
      const data = await API.graphql(
        graphqlOperation(createVocabClozeQuestion, {
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

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderQuestionTextEditor()}
        {renderSubQn1()}
        {renderSubQn2()}
        {renderSubQn3()}
        {renderSubQn4()}
        {renderSubQn5()}
        {renderExpectedTimeInput()}
        <Container
          style={{
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <Button primary type="submit">
            Submit
          </Button>
          <Button secondary type="button" onClick={() => setPreviewing(true)}>
            Preview (iPhone X)
          </Button>
        </Container>
      </Form>
    );
  };
  const [previewing, setPreviewing] = useState(false);
  const renderPreview = () => {
    const subQuestions = {
      subQn1: qn1,
      subQn2: qn2,
      subQn3: qn3,
      subQn4: qn4,
      subQn5: qn5,
    };
    if (previewing) {
      return (
        <VocabularyClozePreview
          questionText={questionText}
          subQuestions={subQuestions}
        />
      );
    }
  };

  return (
    <Container>
      {renderForm()}
      {renderPreview()}
      {renderQuestionCreatedModal()}
    </Container>
  );
};

const renderCKEditor = (label, item, namePrefix) => {
  return (
    <Form.Field
      style={{
        marginTop: "25px",
        borderStyle: "solid",
        borderColor: "#DEDEDE",
        borderWidth: "1px",
        padding: "10px",
      }}
    >
      <label>{label}</label>
      <CKEditor
        editor={ClassicEditor}
        {...item}
        config={{
          AmplifyUpload: {
            storage: Storage,
            namePrefix,
          },
        }}
      />
    </Form.Field>
  );
};

const useCKInput = (initialValue) => {
  const [data, setData] = useState(initialValue);
  const handleChange = (event, editor) => {
    setData(editor.getData());
  };
  return {
    data,
    onChange: handleChange,
  };
};

const VocabularyClozePreview = (props) => {
  const { questionText, subQuestions } = props;
  const clozeHeader = (
    <Header as="h3" style={{ paddingLeft: "10px" }}>
      Vocabulary Cloze
    </Header>
  );
  const clozeText = (
    <Container textAlign="left" style={{ padding: "0 10px 0 10px" }}>
      {ReactHtmlParser(questionText.data)}
    </Container>
  );
  const [activeQuestion, setActiveQuestion] = useState(0);
  const renderPrevNextButtons = () => {
    return (
      <Button.Group>
        <Button
          type="button"
          onClick={() =>
            activeQuestion - 1 < 0
              ? setActiveQuestion(0)
              : setActiveQuestion(activeQuestion - 1)
          }
          floated="left"
        >
          Previous Question
        </Button>
        <Button
          type="button"
          floated="right"
          onClick={() =>
            activeQuestion + 1 > 5
              ? setActiveQuestion(4)
              : setActiveQuestion(activeQuestion + 1)
          }
        >
          Next Question
        </Button>
      </Button.Group>
    );
  };
  const currentOptions = subQuestions[`subQn${activeQuestion + 1}`];
  const renderQuestion = () => {
    const renderedOptions = _.shuffle(Object.keys(currentOptions)).map(
      (key) => {
        return (
          <Container
            key={key}
            style={{ paddingTop: "5px", paddingBottom: "5px" }}
          >
            <Button fluid>{currentOptions[key]}</Button>
          </Container>
        );
      }
    );
    return (
      <Container style={{ paddingTop: "15px" }}>
        <Header as="h4">Question {activeQuestion + 1}</Header>
        {renderedOptions}
      </Container>
    );
  };

  const Component = () => (
    <Container style={{ paddingTop: "10px" }}>
      {clozeHeader}
      {clozeText}
      {renderQuestion()}
      {renderPrevNextButtons()}
    </Container>
  );

  return <Previewer Component={Component} />;
};

const ManageVocabCloze = (props) => {
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
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
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
        graphqlOperation(listVocabClozeQuestions, {
          questionTypeID: QT_VOCAB_CLOZE_ID,
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
              Question Text:{" "}
              {ReactHtmlParser(newlyDeletedQuestion.questionText)}
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
    const { id, questionText } = question;
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{ReactHtmlParser(questionText)}</Table.Cell>
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
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>{id}</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Cloze Passage Text</Table.Cell>
                  <Table.Cell>{ReactHtmlParser(questionText)}</Table.Cell>
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
  const { id, levelID, questionText, expectedTime } = question;
  const subQuestions = JSON.parse(question.subQuestions);
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
  const newQuestionText = useCKInput(questionText);
  const renderQuestionTextEditor = () => {
    const namePrefix = "vocabularyCloze/";
    const questionTextLabel = "Cloze Passage Text";
    return renderCKEditor(questionTextLabel, newQuestionText, namePrefix);
  };

  const [qn1, setQn1] = useState({ ...subQuestions.subQn1 });
  const renderSubQn1 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 1</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn1.answer}
              onChange={(e) => setQn1({ ...qn1, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn1.wo1}
              onChange={(e) => setQn1({ ...qn1, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn1.wo2}
              onChange={(e) => setQn1({ ...qn1, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn1.wo3}
              onChange={(e) => setQn1({ ...qn1, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn2, setQn2] = useState({ ...subQuestions.subQn2 });
  const renderSubQn2 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 2</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn2.answer}
              onChange={(e) => setQn2({ ...qn2, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn2.wo1}
              onChange={(e) => setQn2({ ...qn2, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn2.wo2}
              onChange={(e) => setQn2({ ...qn2, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn2.wo3}
              onChange={(e) => setQn2({ ...qn2, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn3, setQn3] = useState({ ...subQuestions.subQn3 });
  const renderSubQn3 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 3</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn3.answer}
              onChange={(e) => setQn3({ ...qn3, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn3.wo1}
              onChange={(e) => setQn3({ ...qn3, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn3.wo2}
              onChange={(e) => setQn3({ ...qn3, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn3.wo3}
              onChange={(e) => setQn3({ ...qn3, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn4, setQn4] = useState({ ...subQuestions.subQn4 });
  const renderSubQn4 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 4</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn4.answer}
              onChange={(e) => setQn4({ ...qn4, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn4.wo1}
              onChange={(e) => setQn4({ ...qn4, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn4.wo2}
              onChange={(e) => setQn4({ ...qn4, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn4.wo3}
              onChange={(e) => setQn4({ ...qn4, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [qn5, setQn5] = useState({ ...subQuestions.subQn5 });
  const renderSubQn5 = () => {
    return (
      <Container style={{ border: "1px solid #E1E1E1", padding: "10px" }}>
        <Header as="h3">Question 5</Header>
        <Form.Group widths="equal">
          <Form.Field>
            <Form.Input
              type="text"
              label="Answer"
              value={qn5.answer}
              onChange={(e) => setQn5({ ...qn5, answer: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 1"
              value={qn5.wo1}
              onChange={(e) => setQn5({ ...qn5, wo1: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 2"
              value={qn5.wo2}
              onChange={(e) => setQn5({ ...qn5, wo2: e.target.value })}
              fluid
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              type="text"
              label="Wrong Option 3"
              value={qn5.wo3}
              onChange={(e) => setQn5({ ...qn5, wo3: e.target.value })}
              fluid
            />
          </Form.Field>
        </Form.Group>
      </Container>
    );
  };

  const [newExpectedTime, setNewExpectedTime] = useState(expectedTime);
  const renderExpectedTimeInput = () => {
    const handleExpectedTime = (e) => {
      const { value } = e.target;
      if (value) {
        setNewExpectedTime(parseInt(value));
      } else {
        setNewExpectedTime("");
      }
    };
    return (
      <Form.Field>
        <Form.Input
          label="Expected Time to Complete Vocabulary Cloze (in minutes)"
          type="number"
          value={newExpectedTime}
          onChange={handleExpectedTime}
        />
      </Form.Field>
    );
  };

  const handleEditSubmit = async () => {
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      questionText: newQuestionText.data,
      expectedTime: newExpectedTime,
      subQuestions: JSON.stringify({
        subQn1: qn1,
        subQn2: qn2,
        subQn3: qn3,
        subQn4: qn4,
        subQn5: qn5,
      }),
    };
    if (_.isEqual(updatedQuestion, question)) {
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
          {renderQuestionTextEditor()}
          {renderSubQn1()}
          {renderSubQn2()}
          {renderSubQn3()}
          {renderSubQn4()}
          {renderSubQn5()}
          {renderExpectedTimeInput()}
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
