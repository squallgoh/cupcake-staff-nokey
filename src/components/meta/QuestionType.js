import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  Button,
  Container,
  Form,
  Header,
  Table,
  Modal,
  Icon,
} from "semantic-ui-react";
import {
  listSubjects,
  createQuestionType,
  listQuestionTypes,
  updateQuestionType,
  deleteQuestionType,
} from "./_graphql";

const QuestionType = () => {
  const [selected, setSelected] = useState("manage");
  const [subjects, setSubjects] = useState([]);
  const componentMap = {
    create: <CreateQuestionType subjects={subjects} />,
    manage: <ManageQuestionTypes subjects={subjects} />,
  };
  const fetchSubjects = async () => {
    const { data } = await API.graphql(graphqlOperation(listSubjects));
    const subjectArray = data.listSubjects.items;
    subjectArray.sort((a, b) => (a.name > b.name ? -1 : 1));
    const subs = subjectArray.map((subject) => {
      return {
        key: subject.id,
        text: subject.longName,
        value: subject.id,
        levels: subject.levels.items,
      };
    });
    setSubjects(subs);
  };
  useEffect(() => {
    fetchSubjects();
  }, []);

  const renderButtons = () => {
    return (
      <>
        <Button.Group widths="2" style={{ paddingTop: "10px" }}>
          <Button
            toggle
            active={selected === "create"}
            onClick={() => setSelected("create")}
          >
            Create New QuestionType
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage QuestionTypes
          </Button>
        </Button.Group>
      </>
    );
  };

  const renderDisplay = () => {
    return componentMap[selected];
  };

  return (
    <Container>
      <Container>{renderButtons()}</Container>
      <Container>{renderDisplay()}</Container>
    </Container>
  );
};

export default QuestionType;

const CreateQuestionType = (props) => {
  const { subjects } = props;
  const [questionTypeName, setQuestionTypeName] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [createdQT, setCreatedQT] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createQuestionType, {
          input: {
            name: questionTypeName,
            subjectID,
          },
        })
      );
      const { id, name, subject } = data.createQuestionType;
      setCreatedQT({
        id,
        name,
        subjectLongName: subject.longName,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name of Question Type</label>
          <input
            type="text"
            placeholder="e.g. Science MCQ or Comprehension Cloze"
            onChange={(e) => setQuestionTypeName(e.target.value)}
            value={questionTypeName}
          />
        </Form.Field>
        <Form.Select
          label="Select Subject"
          options={subjects}
          placeholder={subjects[0].text}
          value={subjectID}
          onChange={(e, { value }) => setSubjectID(value)}
        />
        <Button fluid primary>
          Submit
        </Button>
      </Form>
    );
  };
  const renderPreview = () => {
    if (Object.keys(createdQT).length > 0) {
      return (
        <Container style={{ paddingTop: "20px" }}>
          <Header as="h3">Successfull Created Question Type:</Header>
          <p>ID: {createdQT.id}</p>
          <p>Name: {createdQT.name}</p>
          <p>Subject: {createdQT.subjectLongName}</p>
        </Container>
      );
    }
  };
  return (
    <Container>
      {renderForm()}
      {renderPreview()}
    </Container>
  );
};

const ManageQuestionTypes = (props) => {
  const { subjects } = props;
  const [questionTypes, setQuestionTypes] = useState([]);
  const [activeQT, setActiveQT] = useState({});
  const [editQT, setEditQT] = useState({});
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const fetchQuestionTypes = async () => {
    const { data } = await API.graphql(graphqlOperation(listQuestionTypes));
    const sortedQTs = data.listQuestionTypes.items.sort((a, b) =>
      a.subjectID > b.subjectID ? -1 : 1
    );
    setQuestionTypes(sortedQTs);
  };
  useEffect(() => {
    fetchQuestionTypes();
  }, []);

  const renderQTHeaders = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Question Type Name</Table.HeaderCell>
          <Table.HeaderCell>Subject</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const handleOpenEdit = (id, name, currentSubjectID) => {
    setActiveQT({ id, name, subjectID: currentSubjectID });
    setEditQT({ id, name, subjectID: currentSubjectID });
    setModalEditOpen(true);
  };

  const handleCloseEdit = () => {
    setActiveQT({});
    setEditQT({});
    setModalEditOpen(false);
  };

  const renderSubjectDropdown = () => {
    return (
      <Form.Select
        label="Select Subject"
        options={subjects}
        value={editQT.subjectID}
        onChange={(e, { value }) => setEditQT({ ...editQT, subjectID: value })}
      />
    );
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, name, subjectID } = editQT;
      await API.graphql(
        graphqlOperation(updateQuestionType, {
          input: {
            id,
            name,
            subjectID,
          },
        })
      );
      fetchQuestionTypes();
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const renderEditQTModal = (id, name, currentSubjectID) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenEdit(id, name, currentSubjectID)}>
            Edit
          </Button>
        }
        open={modalEditOpen}
        onClose={handleCloseEdit}
        size="small"
        centered={false}
      >
        <Header>Edit Question Type</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Question Type Name</label>
              <input
                placeholder={activeQT.name}
                type="text"
                onChange={(e) => setEditQT({ ...editQT, name: e.target.value })}
                value={editQT.name}
              />
            </Form.Field>
            {renderSubjectDropdown()}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={handleSubmitEdit}>
            <Icon name="checkmark" /> Submit
          </Button>
          <Button secondary onClick={handleCloseEdit}>
            <Icon name="undo" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const handleOpenDelete = (id, name, levels) => {
    setActiveQT({ id, name });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setActiveQT({});
    setModalDeleteOpen(false);
  };
  const handleDeleteSubject = async (e) => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteQuestionType, {
          input: { id: activeQT.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setQuestionTypes(
          questionTypes.filter((qt) => qt.id !== data.deleteQuestionType.id)
        );
      }

      setModalDeleteOpen(false);
      fetchQuestionTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const renderDeleteQTModal = (id, name) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenDelete(id, name)}>Delete</Button>
        }
        open={modalDeleteOpen}
        onClose={handleCloseDelete}
        size="small"
        centered={false}
      >
        <Header>
          Are you sure you want to delete the following Question Type?
        </Header>
        <Modal.Content>
          <p>ID: {activeQT.id}</p>
          <p>Question Type Name: {activeQT.name}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleDeleteSubject}>
            <Icon name="delete" /> Delete
          </Button>
          <Button secondary onClick={handleCloseDelete}>
            <Icon name="undo" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const renderQTRows = () => {
    const rows = questionTypes.map((qt) => {
      const { id, name } = qt;
      const subjectLongName = qt.subject.longName;
      const currentSubjectID = qt.subjectID;
      return (
        <Table.Row key={id}>
          <Table.Cell width={3}>{id}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{subjectLongName}</Table.Cell>
          <Table.Cell>
            {renderEditQTModal(id, name, currentSubjectID)}
            {renderDeleteQTModal(id, name)}
          </Table.Cell>
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  const renderQTs = () => {
    return (
      <Table style={{ paddingTop: "30px" }}>
        {renderQTHeaders()}
        {renderQTRows()}
      </Table>
    );
  };

  return <Container>{renderQTs()}</Container>;
};
