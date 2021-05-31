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
  listSkills,
  createSubSkill,
  listSubSkills,
  updateSubSkill,
  deleteSubSkill,
} from "./_graphql";

const SubSkill = () => {
  const [selected, setSelected] = useState("manage");
  const [skills, setSkills] = useState([]);
  const componentMap = {
    create: <CreateSubSkill skills={skills} />,
    manage: <ManageSubSkills skills={skills} />,
  };
  const fetchSkills = async () => {
    const { data } = await API.graphql(graphqlOperation(listSkills));
    const skillArray = data.listSkills.items;
    skillArray.sort((a, b) =>
      `${a.skillGroup.name}-${a.name}` > `${b.skillGroup.name}-${b.name}`
        ? 1
        : -1
    );
    const subs = skillArray.map((skill) => {
      return {
        key: skill.id,
        text: `${skill.skillGroup.name}/${skill.name}`,
        value: skill.id,
      };
    });
    setSkills(subs);
  };

  useEffect(() => {
    fetchSkills();
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
            Create New Sub Skill
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage Sub Skills
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

export default SubSkill;

const CreateSubSkill = (props) => {
  const { skills } = props;
  const [subSkillName, setSubSkillName] = useState("");
  const [skillID, setSkillID] = useState("");
  const [createdSubSkill, setCreatedSubSkill] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createSubSkill, {
          input: {
            name: subSkillName,
            skillID,
          },
        })
      );
      const { id, name, skill } = data.createSubSkill;
      setCreatedSubSkill({
        id,
        name,
        skillName: skill.name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Name of Sub Skill</label>
          <input
            type="text"
            placeholder="e.g. Simple Present Tense, etc"
            onChange={(e) => setSubSkillName(e.target.value)}
            value={subSkillName}
          />
        </Form.Field>
        <Form.Select
          label="Select Skill"
          options={skills}
          placeholder={skills[0] ? skills[0].text : ""}
          value={skillID}
          onChange={(e, { value }) => setSkillID(value)}
        />
        <Button fluid primary>
          Submit
        </Button>
      </Form>
    );
  };
  const renderPreview = () => {
    if (Object.keys(createdSubSkill).length > 0) {
      return (
        <Container style={{ paddingTop: "20px" }}>
          <Header as="h3">Successfully Created Sub Skill:</Header>
          <p>ID: {createdSubSkill.id}</p>
          <p>Name: {createdSubSkill.name}</p>
          <p>Subject: {createdSubSkill.skillName}</p>
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

const ManageSubSkills = (props) => {
  const { skills } = props;
  const [subSkills, setSubSkills] = useState([]);
  const [activeSubSkill, setActiveSubSkill] = useState({});
  const [editSubSkill, setEditSubSkill] = useState({});
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const fetchSubSkills = async () => {
    const { data } = await API.graphql(graphqlOperation(listSubSkills));
    const sortedSubSkills = data.listSubSkills.items.sort((a, b) =>
      `${a.skill.skillGroupID}-${a.skillID}` <
      `${b.skill.skillGroupID}-${b.skillID}`
        ? -1
        : 1
    );
    setSubSkills(sortedSubSkills);
  };
  useEffect(() => {
    fetchSubSkills();
  }, []);

  const renderSubSkillHeaders = () => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Sub Skill Name</Table.HeaderCell>
          <Table.HeaderCell>Skill</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  const handleOpenEdit = (id, name, currentSkillID) => {
    setActiveSubSkill({ id, name, skillID: currentSkillID });
    setEditSubSkill({ id, name, skillID: currentSkillID });
    setModalEditOpen(true);
  };

  const handleCloseEdit = () => {
    setActiveSubSkill({});
    setEditSubSkill({});
    setModalEditOpen(false);
  };

  const renderSkillDropdown = () => {
    return (
      <Form.Select
        label="Select Subject"
        options={skills}
        value={editSubSkill.skillID}
        onChange={(e, { value }) =>
          setEditSubSkill({ ...editSubSkill, skillID: value })
        }
      />
    );
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const { id, name, skillID } = editSubSkill;
      await API.graphql(
        graphqlOperation(updateSubSkill, {
          input: {
            id,
            name,
            skillID,
          },
        })
      );
      fetchSubSkills();
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const renderEditSubSkillModal = (id, name, currentSkillID) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenEdit(id, name, currentSkillID)}>
            Edit
          </Button>
        }
        open={modalEditOpen}
        onClose={handleCloseEdit}
        size="small"
        centered={false}
      >
        <Header>Edit Sub Skill</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Sub Skill Name</label>
              <input
                placeholder={activeSubSkill.name}
                type="text"
                onChange={(e) =>
                  setEditSubSkill({ ...editSubSkill, name: e.target.value })
                }
                value={editSubSkill.name}
              />
            </Form.Field>
            {renderSkillDropdown()}
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
    setActiveSubSkill({ id, name });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => {
    setActiveSubSkill({});
    setModalDeleteOpen(false);
  };
  const handleDeleteSubSkill = async (e) => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteSubSkill, {
          input: { id: activeSubSkill.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setSubSkills(
          subSkills.filter((ssk) => ssk.id !== data.deleteSubSkill.id)
        );
      }

      setModalDeleteOpen(false);
      fetchSubSkills();
    } catch (error) {
      console.error(error);
    }
  };

  const renderDeleteSubSkillModal = (id, name) => {
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
          Are you sure you want to delete the following Sub Skill?
        </Header>
        <Modal.Content>
          <p>ID: {activeSubSkill.id}</p>
          <p>Sub Skill Name: {activeSubSkill.name}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleDeleteSubSkill}>
            <Icon name="delete" /> Delete
          </Button>
          <Button secondary onClick={handleCloseDelete}>
            <Icon name="undo" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const renderSubSkillRows = () => {
    const rows = subSkills.map((top) => {
      const { id, name } = top;
      const skillName = `${top.skill.skillGroup.name}/${top.skill.name}`;
      const currentSkillID = top.skillID;
      return (
        <Table.Row key={id}>
          <Table.Cell width={3}>{id}</Table.Cell>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>{skillName}</Table.Cell>
          <Table.Cell>
            {renderEditSubSkillModal(id, name, currentSkillID)}
            {renderDeleteSubSkillModal(id, name)}
          </Table.Cell>
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  const renderSkills = () => {
    return (
      <Table style={{ paddingTop: "30px" }}>
        {renderSubSkillHeaders()}
        {renderSubSkillRows()}
      </Table>
    );
  };

  return <Container>{renderSkills()}</Container>;
};
