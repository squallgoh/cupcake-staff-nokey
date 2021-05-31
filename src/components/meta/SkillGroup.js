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
  createSkillGroup,
  listSkillGroups,
  updateSkillGroup,
  deleteSkillGroup,
} from "./_graphql";

const SkillGroup = () => {
  const [selected, setSelected] = useState("manage");
  const [subjects, setSubjects] = useState([]);
  const componentMap = {
    create: <CreateSkillGroup subjects={subjects} />,
    manage: <ManageSkillGroups subjects={subjects} />,
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
            Create New Skill Group
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage Skill Groups
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

export default SkillGroup;

const CreateSkillGroup = (props) => {
  const { subjects } = props;
  const [skillGroupName, setSkillGroupName] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [createdSkillGroup, setCreatedSkillGroup] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createSkillGroup, {
          input: {
            name: skillGroupName,
            subjectID,
          },
        })
      );
      const { id, name, subject } = data.createSkillGroup;
      setCreatedSkillGroup({
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
          <label>Name of Skill Group</label>
          <input
            type="text"
            placeholder="e.g. Grammar, Vocabulary, Speech"
            onChange={(e) => setSkillGroupName(e.target.value)}
            value={skillGroupName}
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
    if (Object.keys(createdSkillGroup).length > 0) {
      return (
        <Container style={{ paddingTop: "20px" }}>
          <Header as="h3">Successfully Created Skill Group:</Header>
          <p>ID: {createdSkillGroup.id}</p>
          <p>Name: {createdSkillGroup.name}</p>
          <p>Subject: {createdSkillGroup.subjectLongName}</p>
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

const ManageSkillGroups = (props) => {
  const { subjects } = props;
  const [skillGroups, setSkillGroups] = useState([]);
  const [activeSkillGroup, setActiveSkillGroup] = useState({});
  const [editSkillGroup, setEditSkillGroup] = useState({});
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const fetchSkillGroups = async () => {
    const { data } = await API.graphql(graphqlOperation(listSkillGroups));
    const sortedSkillGroups = data.listSkillGroups.items.sort((a, b) =>
      a.subjectID > b.subjectID ? -1 : 1
    );
    setSkillGroups(sortedSkillGroups);
  };
  useEffect(() => {
    fetchSkillGroups();
  }, []);

  const renderSkillGroupHeaders = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Skill Group Name</Table.HeaderCell>
          <Table.HeaderCell>Subject</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const handleOpenEdit = (id, name, currentSubjectID) => {
    setActiveSkillGroup({ id, name, subjectID: currentSubjectID });
    setEditSkillGroup({ id, name, subjectID: currentSubjectID });
    setModalEditOpen(true);
  };

  const handleCloseEdit = () => {
    setActiveSkillGroup({});
    setEditSkillGroup({});
    setModalEditOpen(false);
  };

  const renderSubjectDropdown = () => {
    return (
      <Form.Select
        label="Select Subject"
        options={subjects}
        value={editSkillGroup.subjectID}
        onChange={(e, { value }) =>
          setEditSkillGroup({ ...editSkillGroup, subjectID: value })
        }
      />
    );
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, name, subjectID } = editSkillGroup;
      await API.graphql(
        graphqlOperation(updateSkillGroup, {
          input: {
            id,
            name,
            subjectID,
          },
        })
      );
      fetchSkillGroups();
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const renderEditSkillGroupModal = (id, name, currentSubjectID) => {
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
        <Header>Edit Skill Group</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Skill Group Name</label>
              <input
                placeholder={activeSkillGroup.name}
                type="text"
                onChange={(e) =>
                  setEditSkillGroup({ ...editSkillGroup, name: e.target.value })
                }
                value={editSkillGroup.name}
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
    setActiveSkillGroup({ id, name });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setActiveSkillGroup({});
    setModalDeleteOpen(false);
  };
  const handleDeleteSkillGroup = async (e) => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteSkillGroup, {
          input: { id: activeSkillGroup.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setSkillGroups(
          skillGroups.filter((skillG) => skillG.id !== data.deleteSkillGroup.id)
        );
      }

      setModalDeleteOpen(false);
      fetchSkillGroups();
    } catch (error) {
      console.error(error);
    }
  };

  const renderDeleteSkillGroupModal = (id, name) => {
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
          Are you sure you want to delete the following Skill Group?
        </Header>
        <Modal.Content>
          <p>ID: {activeSkillGroup.id}</p>
          <p>Skill Group Name: {activeSkillGroup.name}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleDeleteSkillGroup}>
            <Icon name="delete" /> Delete
          </Button>
          <Button secondary onClick={handleCloseDelete}>
            <Icon name="undo" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const renderSkillGroupRows = () => {
    const rows = skillGroups.map((top) => {
      const { id, name } = top;
      const subjectLongName = top.subject.longName;
      const currentSubjectID = top.subjectID;
      return (
        <Table.Row key={id}>
          <Table.Cell width={3}>{id}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{subjectLongName}</Table.Cell>
          <Table.Cell>
            {renderEditSkillGroupModal(id, name, currentSubjectID)}
            {renderDeleteSkillGroupModal(id, name)}
          </Table.Cell>
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  const renderSkillGroups = () => {
    return (
      <Table style={{ paddingTop: "30px" }}>
        {renderSkillGroupHeaders()}
        {renderSkillGroupRows()}
      </Table>
    );
  };

  return <Container>{renderSkillGroups()}</Container>;
};
