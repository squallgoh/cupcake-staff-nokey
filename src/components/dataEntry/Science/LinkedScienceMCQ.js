import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Form,
  Button,
  Header,
  Segment,
  Modal,
  Icon,
  Table,
  Divider,
} from "semantic-ui-react";
import DatePicker from "react-datepicker";
import { v4 as uuid } from "uuid";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  getSubject,
  listQuestionsByQuestionTypeByCreatedAt,
  updateQuestion,
  deleteQuestion,
  createQuestion,
} from "./_graphql";
import {
  SCIENCE_SUBJECT_ID,
  QT_SCIENCE_LINKED_MCQ_ID,
  Data_Entry_Staff,
} from "../_config.json";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@squallgoh/ckeditor5-for-cupcake";
import MathJax from "react-mathjax-preview";
import Previewer from "../Previewer";
import _ from "lodash";
import { removeFigureTag } from "../../../_common";

import "react-datepicker/dist/react-datepicker.css";

const LinkedScienceMCQ = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateLinkedScienceMCQ subject={subject} />,
    manage: <ManageLinkedScienceMCQ subject={subject} />,
  };

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  const fetchSubject = async () => {
    const { data } = await API.graphql(
      graphqlOperation(getSubject, { id: SCIENCE_SUBJECT_ID })
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
      <Header>Science MCQ with Common Preamble</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default LinkedScienceMCQ;

const CreateLinkedScienceMCQ = (props) => {
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

  const [numOfSubQuestions, setNumOfSubQuestions] = useState(2);
  const renderNumOfSubQuestionsInput = () => {
    const options = [
      { key: "2", value: 2, text: "2" },
      { key: "3", value: 3, text: "3" },
      { key: "4", value: 4, text: "4" },
    ];
    const handleNumInput = (value) => {
      let new_sub_qn_state = {};
      for (let i = 0; i < value; i++) {
        let num = (i + 1).toString();
        new_sub_qn_state = {
          ...new_sub_qn_state,
          [num]: { ...blankSubQnState },
        };
      }
      setSubQnState(new_sub_qn_state);
      setNumOfSubQuestions(value);
    };
    return (
      <Form.Select
        label="Number of Sub-Questions"
        options={options}
        value={numOfSubQuestions}
        onChange={(e, { value }) => handleNumInput(value)}
      />
    );
  };

  const preamble = useCKInput("");
  const renderPreambleEditor = () => {
    const namePrefix = `scienceMCQ/linked-${questionID}/preamble-`;
    const label = "Common Preamble";
    return renderCKEditor(label, preamble, namePrefix);
  };

  const blankSubQnState = {
    subQnText: "",
    subQnAnswer: "",
    subQnExplanation: "",
    subQnOptions: { A: "", B: "", C: "" },
    subQnMarks: 2,
  };
  const INITIAL_SUB_QN_STATE = {
    1: { ...blankSubQnState },
    2: { ...blankSubQnState },
  };
  const [subQnState, setSubQnState] = useState({ ...INITIAL_SUB_QN_STATE });

  const renderSubQnText = (num) => {
    const label = `Question Text for Sub-Question ${num}`;
    const namePrefix = `scienceMCQ/${questionID}/subQuestionText${num}-`;
    const value = subQnState[num].subQnText;
    const setValue = (value) => {
      setSubQnState({
        ...subQnState,
        [num]: { ...subQnState[num], subQnText: value },
      });
    };
    return renderCKEditorSub(
      label,
      value,
      setValue,
      namePrefix,
      `SubQnText${num}`
    );
  };
  const renderSubQnAnswer = (num) => {
    const label = `Answer for Sub-Question ${num}`;
    const namePrefix = `scienceMCQ/${questionID}/subAnswer${num}-`;
    const value = subQnState[num].subQnAnswer;
    const setValue = (value) => {
      setSubQnState({
        ...subQnState,
        [num]: { ...subQnState[num], subQnAnswer: value },
      });
    };
    return renderCKEditorSub(
      label,
      value,
      setValue,
      namePrefix,
      `SubQnAnswer${num}`
    );
  };

  const renderSubQnExplanation = (num) => {
    const label = `Explanation for Sub-Question ${num}`;
    const namePrefix = `scienceMCQ/${questionID}/subExplanation${num}-`;
    const value = subQnState[num].subQnExplanation;
    const setValue = (value) => {
      setSubQnState({
        ...subQnState,
        [num]: { ...subQnState[num], subQnExplanation: value },
      });
    };
    return renderCKEditorSub(
      label,
      value,
      setValue,
      namePrefix,
      `SubQnExplanation${num}`
    );
  };
  const renderSubQnWrongOptions = (num) => {
    return ["A", "B", "C"].map((part) => {
      const label = `Wrong Option ${part} for Sub-Question ${num}`;
      const namePrefix = `scienceMCQ/${questionID}/subQn${num}wrongOption${part}`;
      const value = subQnState[num].subQnOptions[part];
      const setValue = (value) => {
        setSubQnState({
          ...subQnState,
          [num]: {
            ...subQnState[num],
            subQnOptions: { ...subQnState[num].subQnOptions, [part]: value },
          },
        });
      };
      return renderCKEditorSub(
        label,
        value,
        setValue,
        namePrefix,
        `SubQn${num}Option${part}`
      );
    });
  };

  const renderSubQns = () => {
    return Object.keys(subQnState).map((num) => {
      return (
        <Container key={`subqn${num}`} style={{ paddingTop: "20px" }}>
          <Divider horizontal>Enter Details for Sub-Question {num}</Divider>
          {renderSubQnText(num)}
          {renderSubQnAnswer(num)}
          {renderSubQnWrongOptions(num)}
          {renderSubQnExplanation(num)}
        </Container>
      );
    });
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
            <MathJax
              math={removeFigureTag(newlyCreatedQuestion.questionText)}
            />
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

  const question = {
    id: questionID,
    topicID,
    subjectID: SCIENCE_SUBJECT_ID,
    levelID,
    questionTypeID: QT_SCIENCE_LINKED_MCQ_ID,
    questionText: preamble.data,
    subQuestions: JSON.stringify(subQnState),
    expectedTime: 2 * numOfSubQuestions,
    isMultiPart: true,
    vetted: false,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await API.graphql(
        graphqlOperation(createQuestion, {
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
    preamble.setData("");
    setNumOfSubQuestions(2);
    setSubQnState({ ...INITIAL_SUB_QN_STATE });
    setQuestionID(uuid());
  };

  const PreviewContent = () => {
    return <PreviewCompoundQuestion compoundQuestion={question} />;
  };
  const [previewing, setPreviewing] = useState(false);
  const renderPreview = () => {
    if (previewing) {
      return <Previewer Component={PreviewContent} />;
    }
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderSelectTopic()}
        {renderNumOfSubQuestionsInput()}
        {renderPreambleEditor()}
        {renderSubQns()}
        {renderQuestionCreatedModal()}
        {renderPreview()}
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

const ManageLinkedScienceMCQ = (props) => {
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

  const staffOptions = Data_Entry_Staff.sort((a, b) => a.num - b.num);
  const [staffID, setStaffID] = useState("");
  const renderSelectStaff = () => {
    return (
      <Form>
        <Form.Select
          fluid
          placeholder="Select Staff"
          options={staffOptions}
          value={staffID}
          onChange={(e, { value }) => setStaffID(value)}
        />
      </Form>
    );
  };
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const renderSelectDates = () => {
    return (
      <Container>
        <Container textAlign="center" fluid>
          <Header as="h3">Select Start Date:</Header>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
          />
          <Header as="h3">Select End Date:</Header>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
          />
        </Container>
      </Container>
    );
  };
  const [questionList, setQuestionList] = useState([]);
  const fetchQuestions = useCallback(() => {
    const fetchQuestionsFromDB = async (startDate, endDate) => {
      try {
        const data = await API.graphql(
          graphqlOperation(listQuestionsByQuestionTypeByCreatedAt, {
            questionTypeID: QT_SCIENCE_LINKED_MCQ_ID,
            createdAt: {
              between: [startDate.toISOString(), endDate.toISOString()],
            },
            filter: { owner: { eq: staffID } },
            limit: 16384,
          })
        );
        setQuestionList(data.data.listQuestionsByQuestionTypeByCreatedAt.items);
      } catch (e) {
        console.error(e);
      }
    };
    fetchQuestionsFromDB(startDate, endDate);
  }, [endDate, startDate, staffID]);

  useEffect(() => {
    if (endDate - startDate > 0 && staffID) {
      fetchQuestions(startDate, endDate);
    }
  }, [fetchQuestions, startDate, endDate, staffID]);

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
    const { id, questionText } = question;
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>
          {<MathJax math={removeFigureTag(questionText)} />}
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
      console.log("Questions:", questionList);
      const questionsBody = questionList.map((question) => {
        return renderQuestion(question);
      });
      return (
        <Table celled columns="11">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={2}>ID</Table.HeaderCell>
              <Table.HeaderCell width={6}>Common Preamble</Table.HeaderCell>
              <Table.HeaderCell width={3}>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{questionsBody}</Table.Body>
        </Table>
      );
    }
  };

  return (
    <Container style={{ paddingTop: "30px" }}>
      {renderSelectStaff()}
      {renderSelectDates()}
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

const renderCKEditorSub = (label, value, setValue, namePrefix, key) => {
  return (
    <Form.Field key={key} style={{ paddingTop: "10px" }}>
      <label>{label}</label>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={(e, editor) => {
          setValue(editor.getData());
        }}
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

const PreviewCompoundQuestion = (props) => {
  const { compoundQuestion } = props;
  const [compoundQnNum, setCompoundQnNum] = useState(0);
  const { questionText: preamble, subQuestions: rawSQ } = compoundQuestion;
  const subQuestions = JSON.parse(rawSQ);
  const numOfSubQuestions = Object.keys(subQuestions).length;
  const renderPreambleComponent = () => {
    return (
      <Container>
        <Segment>
          <Header as="h3">
            Please use the information below to answer the next{" "}
            {numOfSubQuestions} questions.
          </Header>
          <MathJax math={removeFigureTag(preamble)} />
        </Segment>
        <Button
          type="button"
          fluid
          positive
          onClick={() => setCompoundQnNum(compoundQnNum + 1)}
        >
          Proceed
        </Button>
      </Container>
    );
  };
  const renderQuestionComponent = (num) => {
    const answer = subQuestions[num].subQnAnswer;
    const questionText = subQuestions[num].subQnText;
    const options = { ...subQuestions[num].subQnOptions, answer };
    const renderedOptions = _.shuffle(Object.keys(options)).map((key) => {
      return (
        <Container
          key={key}
          style={{ paddingTop: "5px", paddingBottom: "5px" }}
        >
          <Button fluid type="button">
            <MathJax math={removeFigureTag(options[key])} />
          </Button>
        </Container>
      );
    });
    return (
      <Container>
        <Header as="h3">Question #</Header>
        <Segment>
          <MathJax math={removeFigureTag(questionText)} />
        </Segment>
        <Container style={{ paddingTop: "15px" }}>{renderedOptions}</Container>
        <Container
          textAlign="center"
          style={{ paddingTop: "15px", paddingBottom: "15px" }}
        >
          <Button.Group>
            <Button
              type="button"
              onClick={() => setCompoundQnNum(compoundQnNum - 1)}
              floated="left"
            >
              Previous Question
            </Button>
            <Button
              type="button"
              floated="right"
              onClick={() =>
                compoundQnNum + 1 > numOfSubQuestions
                  ? setCompoundQnNum(compoundQnNum)
                  : setCompoundQnNum(compoundQnNum + 1)
              }
            >
              Next Question
            </Button>
          </Button.Group>
        </Container>
      </Container>
    );
  };
  const Compo = () => {
    if (compoundQnNum === 0) {
      return <>{renderPreambleComponent()}</>;
    } else {
      return <>{renderQuestionComponent(compoundQnNum)}</>;
    }
  };

  return <Previewer Component={Compo} />;
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
  } = props;
  const {
    id,
    levelID,
    topicID,
    questionText,
    questionTypeID,
    subQuestions: rawSQ,
  } = question;
  const INITIAL_QUESTION = {
    id,
    levelID,
    topicID,
    questionTypeID,
    questionText,
    subQuestions: rawSQ,
  };
  const subQuestions = JSON.parse(rawSQ);
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

  const newPreamble = useCKInput(questionText);
  const renderPreambleEditor = () => {
    const namePrefix = `scienceMCQ/linked-${id}/preamble-`;
    const label = "CommonPreamble";
    return renderCKEditor(label, newPreamble, namePrefix);
  };

  const [subQnState, setSubQnState] = useState(subQuestions);

  const renderSubQnText = (num) => {
    const label = `Question Text for Sub-Question ${num}`;
    const namePrefix = `scienceMCQ/${id}/subQuestionText${num}-`;
    const value = subQnState[num].subQnText;
    const setValue = (value) => {
      setSubQnState({
        ...subQnState,
        [num]: { ...subQnState[num], subQnText: value },
      });
    };
    return renderCKEditorSub(
      label,
      value,
      setValue,
      namePrefix,
      `SubQnText${num}`
    );
  };
  const renderSubQnAnswer = (num) => {
    const label = `Answer for Sub-Question ${num}`;
    const namePrefix = `scienceMCQ/${id}/subAnswer${num}-`;
    const value = subQnState[num].subQnAnswer;
    const setValue = (value) => {
      setSubQnState({
        ...subQnState,
        [num]: { ...subQnState[num], subQnAnswer: value },
      });
    };
    return renderCKEditorSub(
      label,
      value,
      setValue,
      namePrefix,
      `SubQnAnswer${num}`
    );
  };
  const renderSubQnExplanation = (num) => {
    const label = `Explanation for Sub-Question ${num}`;
    const namePrefix = `scienceMCQ/${id}/subExplanation${num}-`;
    const value = subQnState[num].subQnExplanation;
    const setValue = (value) => {
      setSubQnState({
        ...subQnState,
        [num]: { ...subQnState[num], subQnExplanation: value },
      });
    };
    return renderCKEditorSub(
      label,
      value,
      setValue,
      namePrefix,
      `SubQnExplanation${num}`
    );
  };
  const renderSubQnWrongOptions = (num) => {
    return ["A", "B", "C"].map((part) => {
      const label = `Wrong Option ${part} for Sub-Question ${num}`;
      const namePrefix = `scienceMCQ/${id}/subQn${num}wrongOption${part}`;
      const value = subQnState[num].subQnOptions[part];
      const setValue = (value) => {
        setSubQnState({
          ...subQnState,
          [num]: {
            ...subQnState[num],
            subQnOptions: { ...subQnState[num].subQnOptions, [part]: value },
          },
        });
      };
      return renderCKEditorSub(
        label,
        value,
        setValue,
        namePrefix,
        `SubQn${num}Option${part}`
      );
    });
  };

  const renderSubQns = () => {
    return Object.keys(subQnState).map((num) => {
      return (
        <Container key={`subqn${num}`} style={{ paddingTop: "20px" }}>
          <Divider horizontal>Enter Details for Sub-Question {num}</Divider>
          {renderSubQnText(num)}
          {renderSubQnAnswer(num)}
          {renderSubQnWrongOptions(num)}
          {renderSubQnExplanation(num)}
        </Container>
      );
    });
  };

  const handleEditSubmit = async () => {
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      topicID: newTopicID,
      questionTypeID,
      questionText: newPreamble.data,
      subQuestions: JSON.stringify(subQnState),
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
          {renderPreambleEditor()}
          {renderSubQns()}
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
  const { id, questionText } = question;

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
                  <Table.Cell>Common Preamble</Table.Cell>
                  <Table.Cell>
                    <MathJax math={removeFigureTag(questionText)} />
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
