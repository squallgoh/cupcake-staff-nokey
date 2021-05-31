import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Header,
  Segment,
  Modal,
  Icon,
  Table,
  List,
} from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  getSubject,
  listQuestionsByTopicByQuestionTypeByLevel,
  updateQuestion,
  deleteQuestion,
  createMathMCQQuestion,
} from "./_graphql";
import { MATH_SUBJECT_ID, QT_MATH_MCQ_ID } from "../_config.json";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@squallgoh/ckeditor5-for-cupcake";
import MathJax from "react-mathjax-preview";
import Previewer from "../Previewer";
import _ from "lodash";
import { removeFigureTag } from "../../../_common";

const MathMCQ = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateMathMCQ subject={subject} />,
    manage: <ManageMathMCQ subject={subject} />,
  };

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  const fetchSubject = async () => {
    const { data } = await API.graphql(
      graphqlOperation(getSubject, { id: MATH_SUBJECT_ID })
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
    <Container>
      <Header>Mathematics MCQ</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default MathMCQ;

const CreateMathMCQ = (props) => {
  const [questionID, setQuestionID] = useState(uuid());

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
      <Form.Select
        label="Level"
        placeholder="Select Level"
        options={levelOptions}
        value={levelID}
        onChange={(e, { value }) => setLevelID(value)}
      />
    );
  };

  const topicOptions = subject.topics.items
    .map((item) => {
      const { id, name, num } = item;
      return {
        key: id,
        value: id,
        text: name,
        num,
      };
    })
    .sort((a, b) => a.num - b.num);
  const [topicID, setTopicID] = useState("");
  const renderSelectTopic = () => {
    return (
      <Form.Select
        label="Topic"
        placeholder="Select Topic"
        options={topicOptions}
        value={topicID}
        onChange={(e, { value }) => setTopicID(value)}
      />
    );
  };

  const questionText = useCKInput("");
  const renderQuestionTextEditor = () => {
    const namePrefix = `mathMCQ/${questionID}/questionText-`;
    const label = "Question Text";
    return renderCKEditor(label, questionText, namePrefix);
  };

  const answer = useCKInput("");
  const renderAnswerEditor = () => {
    const namePrefix = `mathMCQ/${questionID}/answer-`;
    const label = "Answer";
    return renderCKEditor(label, answer, namePrefix);
  };

  const wrongOptionA = useCKInput("");
  const renderWrongOptionAEditor = () => {
    const namePrefix = `mathMCQ/${questionID}/wrongOptionA-`;
    const label = "Wrong Option A";
    return renderCKEditor(label, wrongOptionA, namePrefix);
  };

  const wrongOptionB = useCKInput("");
  const renderWrongOptionBEditor = () => {
    const namePrefix = `mathMCQ/${questionID}/wrongOptionB-`;
    const label = "Wrong Option B";
    return renderCKEditor(label, wrongOptionB, namePrefix);
  };

  const wrongOptionC = useCKInput("");
  const renderWrongOptionCEditor = () => {
    const namePrefix = `mathMCQ/${questionID}/wrongOptionC-`;
    const label = "Wrong Option C";
    return renderCKEditor(label, wrongOptionC, namePrefix);
  };

  const [marks, setMarks] = useState(1);
  const renderMarksInput = () => {
    const options = [
      { key: "1", value: 1, text: "1" },
      { key: "2", value: 2, text: "2" },
    ];
    return (
      <Form.Select
        label="Marks"
        options={options}
        value={marks}
        onChange={(e, { value }) => setMarks(value)}
      />
    );
  };

  const PreviewContent = () => {
    const labels = ["A", "B", "C", "D"];
    const options = _.shuffle([
      answer,
      wrongOptionA,
      wrongOptionB,
      wrongOptionC,
    ]).map((item, i) => {
      return (
        <Button basic fluid key={i} type="button">
          <Header as="h4">{labels[i]}</Header>
          <MathJax math={removeFigureTag(item.data)} />
        </Button>
      );
    });
    return (
      <Container style={{ padding: "10px" }}>
        <Header as="h4">Question X</Header>
        <Container>
          <MathJax math={removeFigureTag(questionText.data)} />
        </Container>
        {options}
        <Button.Group fluid style={{ paddingTop: "15px" }}>
          <Button type="button" secondary>
            Previous
          </Button>
          <Button type="button" positive>
            Next
          </Button>
        </Button.Group>
      </Container>
    );
  };
  const [previewing, setPreviewing] = useState(false);
  const renderPreview = () => {
    if (previewing) {
      return <Previewer Component={PreviewContent} />;
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
          onClose={() => setNewlyCreatedQuestion({})}
        >
          <Header icon="check" content="Question Successfully Created" />
          <Modal.Content>
            <p>Question Text: </p>
            <MathJax math={newlyCreatedQuestion.questionText} />
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
      id: questionID,
      levelID,
      topicID,
      questionTypeID: QT_MATH_MCQ_ID,
      subjectID: MATH_SUBJECT_ID,
      questionText: removeFigureTag(questionText.data),
      answer: removeFigureTag(answer.data),
      wrongOptions: JSON.stringify({
        wrongOptionA: removeFigureTag(wrongOptionA.data),
        wrongOptionB: removeFigureTag(wrongOptionB.data),
        wrongOptionC: removeFigureTag(wrongOptionC.data),
      }),
      marks,
      expectedTime: 2,
      isMultiPart: false,
      vetted: false,
    };
    try {
      const data = await API.graphql(
        graphqlOperation(createMathMCQQuestion, {
          input: {
            ...question,
          },
        })
      );
      setNewlyCreatedQuestion({ ...data.data.createQuestion });
      setQuestionID(uuid());
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearForm = () => {
    setLevelID("");
    setTopicID("");
    questionText.setData("");
    answer.setData("");
    wrongOptionA.setData("");
    wrongOptionB.setData("");
    wrongOptionC.setData("");
    setMarks(1);
    setQuestionID(uuid());
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderSelectTopic()}
        {renderQuestionTextEditor()}
        {renderAnswerEditor()}
        {renderWrongOptionAEditor()}
        {renderWrongOptionBEditor()}
        {renderWrongOptionCEditor()}
        {renderMarksInput()}
        {renderPreview()}
        {renderQuestionCreatedModal()}
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
      </Form>
    );
  };
  return <Container>{renderForm()}</Container>;
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
        data={item.data}
        onChange={item.onChange}
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
    setData,
  };
};

const ManageMathMCQ = (props) => {
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
          label="Level"
          placeholder="Select Level"
          options={levelOptions}
          value={levelID}
          onChange={(e, { value }) => setLevelID(value)}
        />
      </Form>
    );
  };

  const topicOptions = subject.topics.items
    .map((item) => {
      const { id, name, num } = item;
      return {
        key: id,
        value: id,
        text: name,
        num,
      };
    })
    .sort((a, b) => a.num - b.num);
  const [topicID, setTopicID] = useState("");
  const renderSelectTopic = () => {
    return (
      <Form.Select
        label="Topic"
        placeholder="Select Topic"
        options={topicOptions}
        value={topicID}
        onChange={(e, { value }) => setTopicID(value)}
      />
    );
  };

  const [questionList, setQuestionList] = useState([]);
  const fetchQuestions = async (topicID, levelID) => {
    try {
      const data = await API.graphql(
        graphqlOperation(listQuestionsByTopicByQuestionTypeByLevel, {
          topicID,
          questionTypeIDLevelID: {
            eq: { questionTypeID: QT_MATH_MCQ_ID, levelID },
          },
        })
      );
      setQuestionList(
        data.data.listQuestionsByTopicByQuestionTypeByLevel.items
      );
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (levelID.length > 0 && topicID.length > 0) {
      fetchQuestions(topicID, levelID);
    }
  }, [levelID, topicID]);

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
            <p>Question Text: </p>
            <MathJax math={newlyDeletedQuestion.questionText} />
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
      return (
        <List.Item key={wo}>{<MathJax math={wrongOptions[wo]} />}</List.Item>
      );
    });
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{<MathJax math={questionText} />}</Table.Cell>
        <Table.Cell>{<MathJax math={answer} />}</Table.Cell>
        <Table.Cell>
          <List bulleted>{renderedWOs}</List>
        </Table.Cell>
        <Table.Cell>
          <Button.Group>
            <EditQuestionModal
              question={question}
              levelOptions={levelOptions}
              topicOptions={topicOptions}
              handleEditModalClose={handleEditModalClose}
              handleEditModalOpen={handleEditModalOpen}
              fetchQuestions={fetchQuestions}
              isEditModalOpen={isEditModalOpen}
              setLevelID={setLevelID}
              setTopicID={setTopicID}
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
        <Table celled columns="15">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>ID</Table.HeaderCell>
              <Table.HeaderCell width={6}>Question Text</Table.HeaderCell>
              <Table.HeaderCell width={2}>Answer</Table.HeaderCell>
              <Table.HeaderCell width={2}>Other Options</Table.HeaderCell>
              <Table.HeaderCell width={3}>Actions</Table.HeaderCell>
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
      {renderSelectTopic()}
      {renderQuestions()}
      {renderQuestionDeletedModal()}
    </Container>
  );
};

const EditQuestionModal = (props) => {
  const {
    question,
    levelOptions,
    topicOptions,
    handleEditModalClose,
    handleEditModalOpen,
    fetchQuestions,
    isEditModalOpen,
    setLevelID,
    setTopicID,
  } = props;
  const {
    id,
    levelID,
    topicID,
    questionText,
    marks,
    answer,
    questionTypeID,
    wrongOptions: rawWrongOptions,
  } = question;
  const INITIAL_QUESTION = {
    id,
    levelID,
    topicID,
    questionText,
    answer,
    wrongOptions: rawWrongOptions,
    questionTypeID,
    marks,
  };
  const wrongOptions = JSON.parse(rawWrongOptions);
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

  const [newTopicID, setNewTopicID] = useState(topicID);
  const renderSelectTopic = () => {
    return (
      <Form.Select
        label="Topic"
        placeholder="Select Topic"
        options={topicOptions}
        value={newTopicID}
        onChange={(e, { value }) => setNewTopicID(value)}
      />
    );
  };

  const newQuestionText = useCKInput(questionText);
  const renderQuestionTextEditor = () => {
    const namePrefix = `mathMCQ/${id}/questionText-`;
    const label = "Question Text";
    return renderCKEditor(label, newQuestionText, namePrefix);
  };

  const newAnswer = useCKInput(answer);
  const renderAnswerInput = () => {
    const namePrefix = `mathMCQ/${id}/answer-`;
    const label = "Answer";
    return renderCKEditor(label, newAnswer, namePrefix);
  };

  const newWrongOptionA = useCKInput(wrongOptions.wrongOptionA);
  const renderWrongOptionAEditor = () => {
    const namePrefix = `mathMCQ/${id}/wrongOptionA-`;
    const label = "Wrong Option A";
    return renderCKEditor(label, newWrongOptionA, namePrefix);
  };

  const newWrongOptionB = useCKInput(wrongOptions.wrongOptionB);
  const renderWrongOptionBEditor = () => {
    const namePrefix = `mathMCQ/${id}/wrongOptionB-`;
    const label = "Wrong Option B";
    return renderCKEditor(label, newWrongOptionB, namePrefix);
  };

  const newWrongOptionC = useCKInput(wrongOptions.wrongOptionC);
  const renderWrongOptionCEditor = () => {
    const namePrefix = `mathMCQ/${id}/wrongOptionC-`;
    const label = "Wrong Option C";
    return renderCKEditor(label, newWrongOptionC, namePrefix);
  };

  const [newMarks, setNewMarks] = useState(marks);
  const renderMarksInput = () => {
    const options = [
      { key: "1", value: 1, text: "1" },
      { key: "2", value: 2, text: "2" },
    ];
    return (
      <Form.Select
        label="Marks"
        options={options}
        value={newMarks}
        onChange={(e, { value }) => setNewMarks(value)}
      />
    );
  };

  const handleEditSubmit = async () => {
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      topicID: newTopicID,
      questionTypeID,
      questionText: removeFigureTag(newQuestionText.data),
      answer: removeFigureTag(newAnswer.data),
      wrongOptions: JSON.stringify({
        wrongOptionA: removeFigureTag(newWrongOptionA.data),
        wrongOptionB: removeFigureTag(newWrongOptionB.data),
        wrongOptionC: removeFigureTag(newWrongOptionC.data),
      }),
      marks: newMarks,
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
      setTopicID(newTopicID);
      fetchQuestions(newTopicID, newLevelID);
      handleEditModalClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      trigger={
        <Button
          type="button"
          size="small"
          primary
          onClick={() => handleEditModalOpen(id)}
        >
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
          {renderSelectTopic()}
          {renderQuestionTextEditor()}
          {renderAnswerInput()}
          {renderWrongOptionAEditor()}
          {renderWrongOptionBEditor()}
          {renderWrongOptionCEditor()}
          {renderMarksInput()}
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
    return (
      <List.Item key={key}>
        <MathJax math={wrongOptions[key]} />
      </List.Item>
    );
  });

  const handleDeleteQuestion = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteQuestion, { input: { id } })
      );
      setNewlyDeletedQuestion({ ...data.deleteQuestion });
      fetchQuestions(data.deleteQuestion.topicID, data.deleteQuestion.levelID);
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
            size="small"
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
                  <Table.Cell>
                    <MathJax math={questionText} />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Answer</Table.Cell>
                  <Table.Cell>
                    <MathJax math={answer} />
                  </Table.Cell>
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
