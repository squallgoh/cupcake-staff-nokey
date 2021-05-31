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
  createTopic,
  listTopics,
  updateTopic,
  deleteTopic,
} from "./_graphql";

const Topic = () => {
  const [selected, setSelected] = useState("manage");
  const [subjects, setSubjects] = useState([]);
  const componentMap = {
    create: <CreateTopic subjects={subjects} />,
    manage: <ManageTopics subjects={subjects} />,
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
            Create New Topic
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage Topics
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

export default Topic;

const CreateTopic = (props) => {
  const { subjects } = props;
  const [topicName, setTopicName] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [createdTopic, setCreatedTopic] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createTopic, {
          input: {
            name: topicName,
            subjectID,
            num: parseInt(topicNum),
          },
        })
      );
      const { id, name, subject } = data.createTopic;
      setCreatedTopic({
        id,
        name,
        subjectLongName: subject.longName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [topicNum, setTopicNum] = useState("");
  const handleIntInput = (e) => {
    const { value } = e.target;
    if (!value || value <= 0) {
      setTopicNum("");
    } else {
      setTopicNum(value);
    }
  };
  const renderNumInput = () => {
    return (
      <Form.Field>
        <label>
          Topic Number (i.e. the order which topic appears in syllabus)
        </label>
        <input
          placeholder='e.g. "5"'
          type="number"
          onChange={handleIntInput}
          value={topicNum}
        />
      </Form.Field>
    );
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name of Topic</label>
          <input
            type="text"
            placeholder="e.g. Algebra, Percentage, Rate etc for Maths; Plant Transport Systems, Energy from Food etc for Science "
            onChange={(e) => setTopicName(e.target.value)}
            value={topicName}
          />
        </Form.Field>
        <Form.Select
          label="Select Subject"
          options={subjects}
          placeholder={subjects[0].text}
          value={subjectID}
          onChange={(e, { value }) => setSubjectID(value)}
        />
        {renderNumInput()}
        <Button fluid primary>
          Submit
        </Button>
      </Form>
    );
  };
  const renderPreview = () => {
    if (Object.keys(createdTopic).length > 0) {
      return (
        <Container style={{ paddingTop: "20px" }}>
          <Header as="h3">Successfull Created Topic:</Header>
          <p>ID: {createdTopic.id}</p>
          <p>Name: {createdTopic.name}</p>
          <p>Subject: {createdTopic.subjectLongName}</p>
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

const ManageTopics = (props) => {
  const { subjects } = props;
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState({});
  const [editTopic, setEditTopic] = useState({});
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const fetchTopics = async () => {
    const { data } = await API.graphql(graphqlOperation(listTopics));
    const sortedTopics = data.listTopics.items.sort((a, b) =>
      a.subjectID > b.subjectID ? -1 : 1
    );
    setTopics(sortedTopics);
  };
  useEffect(() => {
    fetchTopics();
  }, []);

  const renderTopicHeaders = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Topic Name</Table.HeaderCell>
          <Table.HeaderCell>Subject</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const handleOpenEdit = (id, name, currentSubjectID, num) => {
    setActiveTopic({ id, name, subjectID: currentSubjectID, num });
    setEditTopic({ id, name, subjectID: currentSubjectID, num });
    setModalEditOpen(true);
  };

  const handleCloseEdit = () => {
    setActiveTopic({});
    setEditTopic({});
    setModalEditOpen(false);
  };

  const renderSubjectDropdown = () => {
    return (
      <Form.Select
        label="Select Subject"
        options={subjects}
        value={editTopic.subjectID}
        onChange={(e, { value }) =>
          setEditTopic({ ...editTopic, subjectID: value })
        }
      />
    );
  };

  const handleIntInput = (e) => {
    const { value } = e.target;
    if (!value || value <= 0) {
      setEditTopic({ ...editTopic, num: "" });
    } else {
      setEditTopic({ ...editTopic, num: parseInt(value) });
    }
  };
  const renderNumInput = () => {
    return (
      <Form.Field>
        <label>
          Topic Number (i.e. the order which topic appears in syllabus)
        </label>
        <input
          placeholder='e.g. "5"'
          type="number"
          onChange={handleIntInput}
          value={editTopic.num}
        />
      </Form.Field>
    );
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, name, subjectID, num } = editTopic;
      await API.graphql(
        graphqlOperation(updateTopic, {
          input: {
            id,
            name,
            subjectID,
            num,
          },
        })
      );
      fetchTopics();
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const renderEditTopicModal = (id, name, currentSubjectID, num) => {
    return (
      <Modal
        trigger={
          <Button
            onClick={() => handleOpenEdit(id, name, currentSubjectID, num)}
          >
            Edit
          </Button>
        }
        open={modalEditOpen}
        onClose={handleCloseEdit}
        size="small"
        centered={false}
      >
        <Header>Edit Topic</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Topic Name</label>
              <input
                placeholder={activeTopic.name}
                type="text"
                onChange={(e) =>
                  setEditTopic({ ...editTopic, name: e.target.value })
                }
                value={editTopic.name}
              />
            </Form.Field>
            {renderSubjectDropdown()}
            {renderNumInput()}
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
    setActiveTopic({ id, name });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setActiveTopic({});
    setModalDeleteOpen(false);
  };
  const handleDeleteSubject = async (e) => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteTopic, {
          input: { id: activeTopic.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setTopics(topics.filter((top) => top.id !== data.deleteTopic.id));
      }

      setModalDeleteOpen(false);
      fetchTopics();
    } catch (error) {
      console.error(error);
    }
  };

  const renderDeleteTopicModal = (id, name) => {
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
        <Header>Are you sure you want to delete the following Topic?</Header>
        <Modal.Content>
          <p>ID: {activeTopic.id}</p>
          <p>Topic Name: {activeTopic.name}</p>
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

  const renderTopicRows = () => {
    const rows = topics.map((top) => {
      const { id, name, num } = top;
      const subjectLongName = top.subject.longName;
      const currentSubjectID = top.subjectID;
      return (
        <Table.Row key={id}>
          <Table.Cell width={3}>{id}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{subjectLongName}</Table.Cell>
          <Table.Cell>
            {renderEditTopicModal(id, name, currentSubjectID, num)}
            {renderDeleteTopicModal(id, name)}
          </Table.Cell>
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  const renderTopics = () => {
    return (
      <Table style={{ paddingTop: "30px" }}>
        {renderTopicHeaders()}
        {renderTopicRows()}
      </Table>
    );
  };

  return <Container>{renderTopics()}</Container>;
};
