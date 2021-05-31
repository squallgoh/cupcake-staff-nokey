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
  Dropdown,
  Divider,
  Accordion,
} from "semantic-ui-react";
import {
  ENGLISH_SUBJECT_ID,
  QT_GRAMMAR_CLOZE_ID,
  GRAMMAR_CLOZE_TOPIC_ID,
} from "./../_config";
import { API, graphqlOperation } from "aws-amplify";
import {
  getSubject,
  updateQuestion,
  deleteQuestion,
  createGrammarClozeQuestion,
  listQuestionsByQuestionTypeAndLevel,
} from "./_graphql";
import Previewer from "../Previewer";
import _ from "lodash";

const GrammarCloze = (props) => {
  const [activeItem, setActiveItem] = useState("");
  const [subject, setSubject] = useState({});
  const createManageMap = {
    create: <CreateGrammarCloze subject={subject} />,
    manage: <ManageGrammarCloze subject={subject} />,
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
      <Header>Grammar Cloze</Header>
      {renderCreateManage()}
      <Container>{createManageMap[activeItem]}</Container>
    </Container>
  );
};

export default GrammarCloze;

const CreateGrammarCloze = (props) => {
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

  const DEFAULT_OPTIONS = {
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    G: "",
    H: "",
    J: "",
    K: "",
    L: "",
    M: "",
    N: "",
    P: "",
    Q: "",
  };
  const [options, setOptions] = useState({ ...DEFAULT_OPTIONS });
  const renderOptionInputs = () => {
    const r = Object.keys(options).map((label) => {
      return renderSingleInput(label, options, setOptions);
    });
    const setA = [r[0], r[3], r[6], r[9], r[12]];
    const setB = [r[1], r[4], r[7], r[10], r[13]];
    const setC = [r[2], r[5], r[8], r[11], r[14]];
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Header as="h4">Options</Header>
        <Form.Group>{setA}</Form.Group>
        <Form.Group>{setB}</Form.Group>
        <Form.Group>{setC}</Form.Group>
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
  };
  const [answers, setAnswers] = useState({ ...DEFAULT_ANSWERS });
  const renderAnswerInputs = () => {
    const r = Object.keys(answers).map((label) => {
      return renderSingleInput(label, answers, setAnswers);
    });
    const setA = [r[0], r[2], r[4], r[6], r[8]];
    const setB = [r[1], r[3], r[5], r[7], r[9]];
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Header as="h4">Answers</Header>
        <Form.Group>{setA}</Form.Group>
        <Form.Group>{setB}</Form.Group>
      </Container>
    );
  };

  const [passage, setPassage] = useState("");
  const renderPassageInput = () => {
    const label = (
      <Fragment>
        <Header as="h4">Grammar Cloze Passage Text</Header>
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
            content="Grammar Cloze Question Successfully Created"
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
      topicID: GRAMMAR_CLOZE_TOPIC_ID,
      questionTypeID: QT_GRAMMAR_CLOZE_ID,
      subjectID: ENGLISH_SUBJECT_ID,
      levelID,
      isMultiPart: true,
      marksPerSubQn: 1,
      expectedTime: 15,
      marks: 10,
      questionText: JSON.stringify({
        passage,
        options,
      }),
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

  const splitNewLines = passage.replace(
    /\n/g,
    "_____[[newLine]]_____[[afterNewLine]]"
  );

  const hardTextArray = splitNewLines.split(/_____/);

  const processedOptions = Object.keys(options).map((key) => {
    return { key, text: `(${key}) ${options[key]}`, value: options[key] };
  });

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
            <Dropdown options={processedOptions} selection />
            {subString}
          </Fragment>
        );
      }
    }
  });

  const [previewing, setPreviewing] = useState(false);
  const renderPreview = () => {
    const Content = (props) => {
      const processedOptions = Object.keys(options).map((key) => {
        return <Table.Cell key={key}>{`(${key}) ${options[key]}`}</Table.Cell>;
      });
      const setA = (
        <Table.Row>
          {processedOptions[0]}
          {processedOptions[5]}
          {processedOptions[10]}
        </Table.Row>
      );

      const setB = (
        <Table.Row>
          {processedOptions[1]}
          {processedOptions[6]}
          {processedOptions[11]}
        </Table.Row>
      );
      const setC = (
        <Table.Row>
          {processedOptions[2]}
          {processedOptions[7]}
          {processedOptions[12]}
        </Table.Row>
      );

      const setD = (
        <Table.Row>
          {processedOptions[3]}
          {processedOptions[8]}
          {processedOptions[13]}
        </Table.Row>
      );

      const setE = (
        <Table.Row>
          {processedOptions[4]}
          {processedOptions[9]}
          {processedOptions[14]}
        </Table.Row>
      );
      const [accordionOpen, setAccordionOpen] = useState(false);
      const renderOptions = () => {
        return (
          <Accordion>
            <Accordion.Title
              active={accordionOpen}
              onClick={() => setAccordionOpen(!accordionOpen)}
            >
              <Icon name="dropdown" />
              Options (Each word can be used only once)
            </Accordion.Title>
            <Accordion.Content active={accordionOpen}>
              <Table>
                <Table.Body>
                  {setA}
                  {setB}
                  {setC}
                  {setD}
                  {setE}
                </Table.Body>
              </Table>
            </Accordion.Content>
          </Accordion>
        );
      };
      const instructions = (
        <Container
          style={{
            lineHeight: "100%",
            padding: "10px",
          }}
        >
          <Header as="h3">Grammar Cloze</Header>
          There are 10 blanks in the passage below. From the list of words,
          choose the most suitable word for each blank. The letters (I) and (O)
          have been omitted to avoid confusion during marking.
        </Container>
      );

      return (
        <Container textAlign="justified">
          {instructions}
          {renderOptions()}
          <Container
            style={{
              padding: "5px",
              lineHeight: "250%",
              overflow: "scroll",
              height: "512px",
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

  const handleClearForm = () => {
    setLevelID("");
    setPassage("");
    setOptions({ ...DEFAULT_OPTIONS });
    setAnswers({ ...DEFAULT_ANSWERS });
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        {renderSelectLevel()}
        {renderOptionInputs()}
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

const ManageGrammarCloze = (props) => {
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
          questionTypeID: QT_GRAMMAR_CLOZE_ID,
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
              Grammar Cloze Text: {newlyDeletedQuestion.questionText.passage}
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
        <Table.Cell>{JSON.parse(questionText).passage}</Table.Cell>
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
  const { id, questionText: rawQT } = question;
  const questionText = JSON.parse(rawQT);

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
  const { id, levelID, questionText, answer: rawAnswer } = question;
  const initial_question = {
    id,
    levelID,
    questionText,
    answer: rawAnswer,
  };
  const answer = JSON.parse(rawAnswer);
  const { passage, options } = JSON.parse(questionText);
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
        <Header as="h4">Grammar Cloze Passage Text</Header>
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

  const [newOptions, setNewOptions] = useState(options);
  const renderOptionInputs = () => {
    const r = Object.keys(newOptions).map((label) => {
      return renderSingleInput(label, newOptions, setNewOptions);
    });
    const setA = [r[0], r[3], r[6], r[9], r[12]];
    const setB = [r[1], r[4], r[7], r[10], r[13]];
    const setC = [r[2], r[5], r[8], r[11], r[14]];
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Header as="h4">Options</Header>
        <Form.Group>{setA}</Form.Group>
        <Form.Group>{setB}</Form.Group>
        <Form.Group>{setC}</Form.Group>
      </Container>
    );
  };

  const [newAnswers, setNewAnswers] = useState(answer);
  const renderNewAnswerInputs = () => {
    const r = Object.keys(newAnswers).map((label) => {
      return renderSingleInput(label, newAnswers, setNewAnswers);
    });
    const setA = [r[0], r[2], r[4], r[6], r[8]];
    const setB = [r[1], r[3], r[5], r[7], r[9]];
    return (
      <Container
        style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}
      >
        <Header as="h4">Answers</Header>
        <Form.Group>{setA}</Form.Group>
        <Form.Group>{setB}</Form.Group>
      </Container>
    );
  };

  const handleEditSubmit = async () => {
    const updatedQuestion = {
      id,
      levelID: newLevelID,
      questionText: JSON.stringify({
        passage: newPassage,
        options: newOptions,
      }),
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
          {renderOptionInputs()}
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
