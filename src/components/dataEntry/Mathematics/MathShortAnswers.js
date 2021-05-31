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
} from "semantic-ui-react";
import { v4 as uuid } from "uuid";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  getSubject,
  listQuestionsByTopicByQuestionTypeByLevel,
  updateQuestion,
  deleteQuestion,
  createMathShortAnswer,
} from "./_graphql";
import { MATH_SUBJECT_ID, QT_MATH_SHORT_ANSWER_ID } from "../_config.json";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@squallgoh/ckeditor5-for-cupcake";
import MathJax from "react-mathjax-preview";
import Previewer from "../Previewer";
import _ from "lodash";
import { removeFigureTag } from "../../../_common";

const MathShortAnswers = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateMathShortAnswer subject={subject} />,
    manage: <ManageMathShortAnswer subject={subject} />,
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
      <Header>Mathematics Short Answer Questions</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default MathShortAnswers;

const CreateMathShortAnswer = (props) => {
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
    const namePrefix = `mathShortAnswer/${questionID}/questionText-`;
    const label = "Question Text";
    return renderCKEditor(label, questionText, namePrefix);
  };

  const answerPrefix = useCKInput("");
  const renderAnswerPrefixEditor = () => {
    const label = 'Answer Prefix such as "$" (Optional)';
    return renderCKEditor(label, answerPrefix, "non_sequitur/");
  };
  // const [answerValue, setAnswerValue] = useState("");
  // const renderAnswerValueInput = () => {
  //   return (
  //     <Form.Input
  //       type="text"
  //       label="Answer Value"
  //       value={answerValue}
  //       onChange={(e) => setAnswerValue(e.target.value)}
  //     />
  //   );
  // };

  const answerValue = useCKInput("");
  const renderAnswerValueInput = () => {
    const label = "Answer Value";
    return renderCKEditor(label, answerValue, "non_sequitur/");
  };

  const answerSuffix = useCKInput("");
  const renderAnswerSuffixEditor = () => {
    const label = 'Answer Suffix such as "cm", "m", "°" (Optional)';
    return renderCKEditor(label, answerSuffix, "non_sequitur/");
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
    return (
      <Container style={{ padding: "10px" }}>
        <Header as="h4">Question X</Header>
        <Container style={{ paddingBottom: "50px" }}>
          <MathJax math={removeFigureTag(questionText.data)} />
        </Container>

        <Form.Group inline>
          <label>
            <MathJax math={answerPrefix.data} />
          </label>
          <Form.Input inline type="number" />
          <label>
            <MathJax math={answerSuffix.data} />
          </label>
        </Form.Group>

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
      questionTypeID: QT_MATH_SHORT_ANSWER_ID,
      subjectID: MATH_SUBJECT_ID,
      questionText: removeFigureTag(questionText.data),
      answer: JSON.stringify({
        answerValue,
        answerPrefix: answerPrefix.data,
        answerSuffix: answerSuffix.data,
      }),
      marks,
      expectedTime: marks * 2,
      isMultiPart: false,
      vetted: false,
    };
    try {
      const data = await API.graphql(
        graphqlOperation(createMathShortAnswer, {
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
    answerPrefix.setData("");
    answerSuffix.setData("");
    answerValue.setData("");
    setMarks(1);
    setQuestionID(uuid());
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderSelectTopic()}
        {renderQuestionTextEditor()}
        {renderAnswerPrefixEditor()}
        {renderAnswerValueInput()}
        {renderAnswerSuffixEditor()}
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

const ManageMathShortAnswer = (props) => {
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
            eq: { questionTypeID: QT_MATH_SHORT_ANSWER_ID, levelID },
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
    const { answerValue, answerPrefix, answerSuffix } = JSON.parse(answer);
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{<MathJax math={questionText} />}</Table.Cell>
        <Table.Cell singleLine>
          <Form>
            <Form.Group inline>
              <MathJax math={answerPrefix} />
              {answerValue}
              <MathJax math={answerSuffix} />
            </Form.Group>
          </Form>
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
        <Table celled columns="13">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>ID</Table.HeaderCell>
              <Table.HeaderCell width={6}>Question Text</Table.HeaderCell>
              <Table.HeaderCell width={2}>Answer</Table.HeaderCell>
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
  } = question;
  const { answerValue, answerPrefix, answerSuffix } = JSON.parse(answer);
  const INITIAL_QUESTION = {
    id,
    levelID,
    topicID,
    questionText,
    answer,
    questionTypeID,
    marks,
  };
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
    const namePrefix = `mathShortAnswer/${id}/questionText-`;
    const label = "Question Text";
    return renderCKEditor(label, newQuestionText, namePrefix);
  };

  const newAnswerPrefix = useCKInput(answerPrefix);
  const renderAnswerPrefixEditor = () => {
    const label = 'Answer Prefix such as "$" (Optional)';
    return renderCKEditor(label, newAnswerPrefix, "non_sequitur/");
  };

  // const [newAnswerValue, setNewAnswerValue] = useState(answerValue);
  // const renderAnswerValueInput = () => {
  //   return (
  //     <Form.Input
  //       type="text"
  //       label="Answer Value"
  //       value={newAnswerValue}
  //       onChange={(e) => setNewAnswerValue(e.target.value)}
  //     />
  //   );
  // };

  const newAnswerValue = useCKInput(answerValue);
  const renderAnswerValueInput = () => {
    const label = "Answer Value";
    return renderCKEditor(label, newAnswerValue, "non_sequitur/");
  };

  const newAnswerSuffix = useCKInput(answerSuffix);
  const renderAnswerSuffixEditor = () => {
    const label = 'Answer Suffix such as "cm", "m", "°" (Optional)';
    return renderCKEditor(label, newAnswerSuffix, "non_sequitur/");
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
      answer: JSON.stringify({
        answerValue: newAnswerValue,
        answerPrefix: newAnswerPrefix.data,
        answerSuffix: newAnswerSuffix.data,
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
          {renderAnswerPrefixEditor()}
          {renderAnswerValueInput()}
          {renderAnswerSuffixEditor()}
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
  const { answerValue, answerPrefix, answerSuffix } = JSON.parse(answer);

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
                  <Table.Cell singleLine>
                    <Form>
                      <Form.Group inline>
                        <MathJax math={answerPrefix} />
                        {answerValue}
                        <MathJax math={answerSuffix} />
                      </Form.Group>
                    </Form>
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
