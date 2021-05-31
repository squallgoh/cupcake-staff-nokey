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
  listSkillGroups,
  createSkill,
  listSkills,
  updateSkill,
  deleteSkill,
} from "./_graphql";

const Skill = () => {
  const [selected, setSelected] = useState("manage");
  const [skillGroups, setSkillGroups] = useState([]);
  const componentMap = {
    create: <CreateSkill skillGroups={skillGroups} />,
    manage: <ManageSkills skillGroups={skillGroups} />,
  };
  const fetchSkillGroups = async () => {
    const { data } = await API.graphql(graphqlOperation(listSkillGroups));
    const skillGroupArray = data.listSkillGroups.items;
    skillGroupArray.sort((a, b) => (a.name > b.name ? -1 : 1));
    const subs = skillGroupArray.map((skillGroup) => {
      return {
        key: skillGroup.id,
        text: skillGroup.name,
        value: skillGroup.id,
      };
    });
    setSkillGroups(subs);
  };

  useEffect(() => {
    fetchSkillGroups();
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
            Create New Skill
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage Skills
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

export default Skill;

const CreateSkill = (props) => {
  const { skillGroups } = props;
  const [skillName, setSkillName] = useState("");
  const [skillGroupID, setSkillGroupID] = useState("");
  const [createdSkill, setCreatedSkill] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createSkill, {
          input: {
            name: skillName,
            skillGroupID,
          },
        })
      );
      const { id, name, skillGroup } = data.createSkill;
      setCreatedSkill({
        id,
        name,
        skillGroupName: skillGroup.name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name of Skill</label>
          <input
            type="text"
            placeholder="e.g. Tenses, Conjunctions, Words Describing Humans etc"
            onChange={(e) => setSkillName(e.target.value)}
            value={skillName}
          />
        </Form.Field>
        <Form.Select
          label="Select Skill Group"
          options={skillGroups}
          placeholder={skillGroups[0].text}
          value={skillGroupID}
          onChange={(e, { value }) => setSkillGroupID(value)}
        />
        <Button fluid primary>
          Submit
        </Button>
      </Form>
    );
  };
  const renderPreview = () => {
    if (Object.keys(createdSkill).length > 0) {
      return (
        <Container style={{ paddingTop: "20px" }}>
          <Header as="h3">Successfully Created Skill:</Header>
          <p>ID: {createdSkill.id}</p>
          <p>Name: {createdSkill.name}</p>
          <p>Subject: {createdSkill.skillGroupName}</p>
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

const ManageSkills = (props) => {
  const { skillGroups } = props;
  const [skills, setSkills] = useState([]);
  const [activeSkill, setActiveSkill] = useState({});
  const [editSkill, setEditSkill] = useState({});
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const fetchSkills = async () => {
    const { data } = await API.graphql(graphqlOperation(listSkills));
    const sortedSkills = data.listSkills.items.sort((a, b) =>
      a.skillGroupID > b.skillGroupID ? -1 : 1
    );
    setSkills(sortedSkills);
  };
  useEffect(() => {
    fetchSkills();
  }, []);

  const renderSkillHeaders = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Skill Name</Table.HeaderCell>
          <Table.HeaderCell>Skill Group</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const handleOpenEdit = (id, name, currentSkillGroupID) => {
    setActiveSkill({ id, name, skillGroupID: currentSkillGroupID });
    setEditSkill({ id, name, skillGroupID: currentSkillGroupID });
    setModalEditOpen(true);
  };

  const handleCloseEdit = () => {
    setActiveSkill({});
    setEditSkill({});
    setModalEditOpen(false);
  };

  const renderSkillGroupDropdown = () => {
    return (
      <Form.Select
        label="Select Subject"
        options={skillGroups}
        value={editSkill.skillGroupID}
        onChange={(e, { value }) =>
          setEditSkill({ ...editSkill, skillGroupID: value })
        }
      />
    );
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, name, skillGroupID } = editSkill;
      await API.graphql(
        graphqlOperation(updateSkill, {
          input: {
            id,
            name,
            skillGroupID,
          },
        })
      );
      fetchSkills();
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const renderEditSkillModal = (id, name, currentSkillGroupID) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenEdit(id, name, currentSkillGroupID)}>
            Edit
          </Button>
        }
        open={modalEditOpen}
        onClose={handleCloseEdit}
        size="small"
        centered={false}
      >
        <Header>Edit Skill</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Skill Name</label>
              <input
                placeholder={activeSkill.name}
                type="text"
                onChange={(e) =>
                  setEditSkill({ ...editSkill, name: e.target.value })
                }
                value={editSkill.name}
              />
            </Form.Field>
            {renderSkillGroupDropdown()}
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
  const handleOpenDelete = (id, name) => {
    setActiveSkill({ id, name });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setActiveSkill({});
    setModalDeleteOpen(false);
  };
  const handleDeleteSkill = async (e) => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteSkill, {
          input: { id: activeSkill.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setSkills(skills.filter((sk) => sk.id !== data.deleteSkill.id));
      }

      setModalDeleteOpen(false);
      fetchSkills();
    } catch (error) {
      console.error(error);
    }
  };

  const renderDeleteSkillModal = (id, name) => {
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
        <Header>Are you sure you want to delete the following Skill?</Header>
        <Modal.Content>
          <p>ID: {activeSkill.id}</p>
          <p>Skill Name: {activeSkill.name}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleDeleteSkill}>
            <Icon name="delete" /> Delete
          </Button>
          <Button secondary onClick={handleCloseDelete}>
            <Icon name="undo" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const renderSkillRows = () => {
    const rows = skills.map((top) => {
      const { id, name } = top;
      const skillGroupName = top.skillGroup.name;
      const currentSkillGroupID = top.skillGroupID;
      return (
        <Table.Row key={id}>
          <Table.Cell width={3}>{id}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{skillGroupName}</Table.Cell>
          <Table.Cell>
            {renderEditSkillModal(id, name, currentSkillGroupID)}
            {renderDeleteSkillModal(id, name)}
          </Table.Cell>
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  const renderSkills = () => {
    return (
      <Table style={{ paddingTop: "30px" }}>
        {renderSkillHeaders()}
        {renderSkillRows()}
      </Table>
    );
  };

  return <Container>{renderSkills()}</Container>;
};
