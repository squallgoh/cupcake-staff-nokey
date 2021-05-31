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
  Image,
  Input,
} from "semantic-ui-react";
import {
  ENGLISH_SUBJECT_ID,
  VISUAL_TEXT_COMPREHENSION_TOPIC_ID,
  QT_VISUAL_TEXT_COMPREHENSION_ID,
} from "./../_config";
import { API, graphqlOperation, Storage } from "aws-amplify";
import {
  getSubject,
  listQuestionsByQuestionTypeAndLevel,
  updateQuestion,
  deleteQuestion,
  createVisualTextQuestion,
} from "./_graphql";
// import Previewer from "../Previewer";
import _ from "lodash";
import { v4 as uuid } from "uuid";

const VisualTextComprehension = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateVisualTextComprehension subject={subject} />,
    manage: <ManageVisualTextComprehension subject={subject} />,
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
      <Header>Visual Text Comprehension</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default VisualTextComprehension;

const CreateVisualTextComprehension = (props) => {
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
        required
        label="Level"
        placeholder="Select Level"
        options={levelOptions}
        value={levelID}
        onChange={(e, { value }) => setLevelID(value)}
      />
    );
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    const extension = file.name.slice(file.name.lastIndexOf(".") + 1);
    let mimeType;
    switch (extension) {
      case "svg":
        mimeType = "image/svg+xml";
        break;
      case "jpg":
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      default:
        mimeType = "image/jpeg";
    }
    setImage({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: file.name,
      contentType: mimeType,
    });
  };
  const [image1, setImage1] = useState({ fileUrl: "", file: "", filename: "" });
  const renderImageUpload1 = () => {
    return (
      <Form.Field style={{ border: "solid 1px #cccccc", padding: "5px" }}>
        <Header as="h4" textAlign="center">
          Visual Text 1
        </Header>
        <Input
          type="file"
          accept="image/png, image/jpeg, image/svg+xml"
          id="visualText1"
          onChange={(e) => handleImageChange(e, setImage1)}
        />
        <Image src={image1.fileUrl} alt="Selected File" centered />
      </Form.Field>
    );
  };
  const [image2, setImage2] = useState({ fileUrl: "", file: "", filename: "" });
  const renderImageUpload2 = () => {
    return (
      <Form.Field style={{ border: "solid 1px #cccccc", padding: "5px" }}>
        <Header as="h4" textAlign="center">
          Visual Text 2
        </Header>
        <Input
          type="file"
          accept="image/png, image/jpeg, image/svg+xml"
          id="visualText2"
          onChange={(e) => handleImageChange(e, setImage2)}
        />
        <Image src={image2.fileUrl} alt="Selected File" centered />
      </Form.Field>
    );
  };

  const subQn1States = useSubQnInput();
  const renderSubQn1 = renderSubQuestionForm("Question 1", subQn1States);

  const subQn2States = useSubQnInput();
  const renderSubQn2 = renderSubQuestionForm("Question 2", subQn2States);

  const subQn3States = useSubQnInput();
  const renderSubQn3 = renderSubQuestionForm("Question 3", subQn3States);

  const subQn4States = useSubQnInput();
  const renderSubQn4 = renderSubQuestionForm("Question 4", subQn4States);

  const subQn5States = useSubQnInput();
  const renderSubQn5 = renderSubQuestionForm("Question 5", subQn5States);

  const subQn6States = useSubQnInput();
  const renderSubQn6 = renderSubQuestionForm("Question 6", subQn6States);

  const subQn7States = useSubQnInput();
  const renderSubQn7 = renderSubQuestionForm("Question 7", subQn7States);

  const subQn8States = useSubQnInput();
  const renderSubQn8 = renderSubQuestionForm("Question 8", subQn8States);

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderImageUpload1()}
        {renderImageUpload2()}
        {renderSubQn1}
        {renderSubQn2}
        {renderSubQn3}
        {renderSubQn4}
        {renderSubQn5}
        {renderSubQn6}
        {renderSubQn7}
        {renderSubQn8}
        <Button primary type="submit">
          Submit
        </Button>
        {/* <Button secondary type="button" onClick={() => setPreviewing("iphone")}>
              Preview (iPhone X)
            </Button> */}
        <Button negative type="button" onClick={handleClearForm}>
          Clear Form
        </Button>
      </Form>
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
            content="Visual Text Comprehension Question Successfully Created"
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
    const filename1 =
      `english/visualTextMCQ/${questionID}/visualText1-` + image1.filename;
    const filename2 =
      `english/visualTextMCQ/${questionID}/visualText2-` + image2.filename;
    e.preventDefault();
    try {
      const { key: key1 } = await Storage.put(filename1, image1.file, {
        contentType: image1.contentType,
      });
      const { key: key2 } = await Storage.put(filename2, image2.file, {
        contentType: image2.contentType,
      });
      const visualText1RawSrc = await Storage.get(key1);
      const visualText1Src = visualText1RawSrc.slice(
        0,
        visualText1RawSrc.indexOf("?")
      );
      const visualText2RawSrc = await Storage.get(key2);
      const visualText2Src = visualText2RawSrc.slice(
        0,
        visualText2RawSrc.indexOf("?")
      );
      const question = {
        id: questionID,
        levelID,
        topicID: VISUAL_TEXT_COMPREHENSION_TOPIC_ID,
        questionTypeID: QT_VISUAL_TEXT_COMPREHENSION_ID,
        subjectID: ENGLISH_SUBJECT_ID,
        questionText: JSON.stringify({
          visualText1: visualText1Src,
          visualText2: visualText2Src,
        }),
        isMultiPart: true,
        subQuestions: JSON.stringify({
          subQn1: { ...subQn1States.states },
          subQn2: { ...subQn2States.states },
          subQn3: { ...subQn3States.states },
          subQn4: { ...subQn4States.states },
          subQn5: { ...subQn5States.states },
          subQn6: { ...subQn6States.states },
          subQn7: { ...subQn7States.states },
          subQn8: { ...subQn8States.states },
        }),
        expectedTime: 16,
        marksPerSubQn: 1,
        marks: 8,
        vetted: false,
      };
      const data = await API.graphql(
        graphqlOperation(createVisualTextQuestion, {
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

  const handleClearForm = () => {
    setLevelID("");
    setQuestionID(uuid());
    // visualText1.setData("");
    // visualText2.setData("");
    const subQns = [
      subQn1States,
      subQn2States,
      subQn3States,
      subQn4States,
      subQn5States,
      subQn6States,
      subQn7States,
      subQn8States,
    ];
    subQns.forEach((subQn) => {
      Object.keys(subQn.setStates).forEach((key) => {
        subQn.setStates[key]("");
      });
    });
  };

  return (
    <Container>
      {renderForm()}
      {renderQuestionCreatedModal()}
    </Container>
  );
};

const ManageVisualTextComprehension = (props) => {
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

  const [questionList, setQuestionList] = useState([]);
  const fetchQuestions = async (levelID) => {
    try {
      const data = await API.graphql(
        graphqlOperation(listQuestionsByQuestionTypeAndLevel, {
          questionTypeID: QT_VISUAL_TEXT_COMPREHENSION_ID,
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
    const qt = JSON.parse(questionText);
    return (
      <Fragment key={id}>
        <Table.Row>
          <Table.Cell style={{ border: "1px solid #222222" }}>{id}</Table.Cell>
          <Table.Cell style={{ border: "1px solid #222222" }}>
            <Image
              src={qt.visualText1}
              alt="Visual Text 1"
              style={{ width: "100%" }}
            />
          </Table.Cell>
          <Table.Cell style={{ border: "1px solid #222222" }}>
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
          </Table.Cell>
        </Table.Row>
      </Fragment>
    );
  };

  const renderQuestions = () => {
    if (questionList.length > 0) {
      const questionsBody = questionList.map((question) => {
        return renderQuestion(question);
      });
      return (
        <Table
          fixed
          celled
          columns={16}
          style={{ border: "1px solid #222222" }}
        >
          <Table.Header style={{ border: "1px solid #222222" }}>
            <Table.Row>
              <Table.HeaderCell
                width={3}
                style={{ border: "1px solid #222222" }}
              >
                ID
              </Table.HeaderCell>
              <Table.HeaderCell
                width={10}
                style={{ border: "1px solid #222222" }}
              >
                Visual Text 1
              </Table.HeaderCell>
              <Table.HeaderCell
                width={3}
                style={{ border: "1px solid #222222" }}
              >
                Actions
              </Table.HeaderCell>
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

const renderSubQuestionForm = (label, state_object) => {
  const { states, setStates } = state_object;
  const { qt, ans, woA, woB, woC } = states;
  const { setQt, setAns, setWoA, setWoB, setWoC } = setStates;
  const renderQTInput = () => {
    return (
      <Form.Field>
        <Form.Input
          type="text"
          label="Question Text:"
          value={qt}
          onChange={(e) => setQt(e.target.value)}
        />
      </Form.Field>
    );
  };
  const renderAnswerInput = () => {
    return (
      <Form.Field>
        <Form.Input
          type="text"
          label="Answer:"
          value={ans}
          onChange={(e) => setAns(e.target.value)}
        />
      </Form.Field>
    );
  };
  const renderWoAInput = () => {
    return (
      <Form.Field>
        <Form.Input
          type="text"
          label="Wrong Option A:"
          value={woA}
          onChange={(e) => setWoA(e.target.value)}
        />
      </Form.Field>
    );
  };
  const renderWoBInput = () => {
    return (
      <Form.Field>
        <Form.Input
          type="text"
          label="Wrong Option B:"
          value={woB}
          onChange={(e) => setWoB(e.target.value)}
        />
      </Form.Field>
    );
  };
  const renderWoCInput = () => {
    return (
      <Form.Field>
        <Form.Input
          type="text"
          label="Wrong Option C:"
          value={woC}
          onChange={(e) => setWoC(e.target.value)}
        />
      </Form.Field>
    );
  };
  return (
    <Container
      style={{
        border: "solid 1px #cccccc",
        padding: "5px",
        marginTop: "25px",
        marginBottom: "25px",
      }}
    >
      <Header as="h4" textAlign="center">
        {label}
      </Header>
      {renderQTInput()}
      <Form.Group widths="equal">
        {renderAnswerInput()}
        {renderWoAInput()}
        {renderWoBInput()}
        {renderWoCInput()}
      </Form.Group>
    </Container>
  );
};

const INITIAL_SUB_QN_STATE = {
  qt: "",
  ans: "",
  woA: "",
  woB: "",
  woC: "",
};

const useSubQnInput = (initialState = INITIAL_SUB_QN_STATE) => {
  const {
    qt: initial_qt,
    ans: initial_answer,
    woA: initial_woA,
    woB: initial_woB,
    woC: initial_woC,
  } = initialState;
  const [qt, setQt] = useState(initial_qt);
  const [ans, setAns] = useState(initial_answer);
  const [woA, setWoA] = useState(initial_woA);
  const [woB, setWoB] = useState(initial_woB);
  const [woC, setWoC] = useState(initial_woC);
  return {
    states: {
      qt,
      ans,
      woA,
      woB,
      woC,
    },
    setStates: {
      setQt,
      setAns,
      setWoA,
      setWoB,
      setWoC,
    },
  };
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
  const { id, levelID, questionText, subQuestions: sqRaw } = question;
  console.log("question", question);
  const subQuestions = JSON.parse(sqRaw);
  const initial_question = { id, levelID, questionText, subQuestions };

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
  const { visualText1, visualText2 } = JSON.parse(questionText);
  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    const extension = file.name.slice(file.name.lastIndexOf(".") + 1);
    let mimeType;
    switch (extension) {
      case "svg":
        mimeType = "image/svg+xml";
        break;
      case "jpg":
        mimeType = "image/jpeg";
        break;
      case "png":
        mimeType = "image/png";
        break;
      default:
        mimeType = "image/jpeg";
    }
    setImage({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: file.name,
      contentType: mimeType,
    });
  };
  const initial_VT1 = {
    fileUrl: visualText1,
    file: "",
    filename: visualText1.slice(visualText1.indexOf("english/")),
  };
  const [newVT1, setNewVT1] = useState({ ...initial_VT1 });
  const renderImageUpload1 = () => {
    return (
      <Form.Field style={{ border: "solid 1px #cccccc", padding: "5px" }}>
        <Header as="h4" textAlign="center">
          Visual Text 1
        </Header>
        <Input
          type="file"
          accept="image/png, image/jpeg, image/svg+xml"
          id="visualText1"
          onChange={(e) => handleImageChange(e, setNewVT1)}
        />
        <Image src={newVT1.fileUrl} alt="Selected File" centered />
      </Form.Field>
    );
  };

  const initial_VT2 = {
    fileUrl: visualText2,
    file: "",
    filename: visualText2.slice(visualText2.indexOf("english/")),
  };
  const [newVT2, setNewVT2] = useState({ ...initial_VT2 });
  const renderImageUpload2 = () => {
    return (
      <Form.Field style={{ border: "solid 1px #cccccc", padding: "5px" }}>
        <Header as="h4" textAlign="center">
          Visual Text 2
        </Header>
        <Input
          type="file"
          accept="image/png, image/jpeg, image/svg+xml"
          id="visualText2"
          onChange={(e) => handleImageChange(e, setNewVT2)}
        />
        <Image src={newVT2.fileUrl} alt="Selected File" centered />
      </Form.Field>
    );
  };

  const handleVisualTextUpload = async (initial, updated, prefix) => {
    if (initial.fileUrl === updated.fileUrl) {
      return initial.fileUrl;
    } else {
      await Storage.remove(initial.filename);
      const enhancedFilename =
        `english/visualTextMCQ/${id}/` + prefix + updated.filename;
      const { key } = await Storage.put(enhancedFilename, updated.file, {
        contentType: updated.contentType,
      });
      const rawSrc = await Storage.get(key);
      const src = rawSrc.slice(0, rawSrc.indexOf("?"));
      return src;
    }
  };
  const subQn1States = useSubQnInput({ ...subQuestions.subQn1 });
  const renderSubQn1 = renderSubQuestionForm("Question 1", subQn1States);

  const subQn2States = useSubQnInput({ ...subQuestions.subQn2 });
  const renderSubQn2 = renderSubQuestionForm("Question 2", subQn2States);

  const subQn3States = useSubQnInput({ ...subQuestions.subQn3 });
  const renderSubQn3 = renderSubQuestionForm("Question 3", subQn3States);

  const subQn4States = useSubQnInput({ ...subQuestions.subQn4 });
  const renderSubQn4 = renderSubQuestionForm("Question 4", subQn4States);

  const subQn5States = useSubQnInput({ ...subQuestions.subQn5 });
  const renderSubQn5 = renderSubQuestionForm("Question 5", subQn5States);

  const subQn6States = useSubQnInput({ ...subQuestions.subQn6 });
  const renderSubQn6 = renderSubQuestionForm("Question 6", subQn6States);

  const subQn7States = useSubQnInput({ ...subQuestions.subQn7 });
  const renderSubQn7 = renderSubQuestionForm("Question 7", subQn7States);

  const subQn8States = useSubQnInput({ ...subQuestions.subQn8 });
  const renderSubQn8 = renderSubQuestionForm("Question 8", subQn8States);

  const handleEditSubmit = async () => {
    const newVisualText1 = await handleVisualTextUpload(
      initial_VT1,
      newVT1,
      "visualText1-"
    );
    const newVisualText2 = await handleVisualTextUpload(
      initial_VT2,
      newVT2,
      "visualText2-"
    );
    const newQuestionText = JSON.stringify({
      visualText1: newVisualText1,
      visualText2: newVisualText2,
    });
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      questionText: newQuestionText,
      subQuestions: JSON.stringify({
        subQn1: { ...subQn1States.states },
        subQn2: { ...subQn2States.states },
        subQn3: { ...subQn3States.states },
        subQn4: { ...subQn4States.states },
        subQn5: { ...subQn5States.states },
        subQn6: { ...subQn6States.states },
        subQn7: { ...subQn7States.states },
        subQn8: { ...subQn8States.states },
      }),
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
      trigger={
        <Button
          type="button"
          primary
          size="large"
          fluid
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
          {renderImageUpload1()}
          {renderImageUpload2()}
          {renderSubQn1}
          {renderSubQn2}
          {renderSubQn3}
          {renderSubQn4}
          {renderSubQn5}
          {renderSubQn6}
          {renderSubQn7}
          {renderSubQn8}
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
  const { visualText1, visualText2 } = JSON.parse(questionText);

  const deleteS3File = async (fullPath) => {
    if (fullPath) {
      const filename = fullPath.slice(fullPath.indexOf("english/"));
      await Storage.remove(filename);
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteQuestion, { input: { id } })
      );
      deleteS3File(visualText1);
      deleteS3File(visualText2);
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
            size="large"
            fluid
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
                  <Table.Cell>Visual Texts</Table.Cell>
                  <Table.Cell>
                    <Image
                      src={visualText1}
                      style={{ width: "100%", border: "solid 1px #cccccc" }}
                    />
                    <Image
                      src={visualText2}
                      style={{ width: "100%", border: "solid 1px #cccccc" }}
                    />
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
