import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Header,
  Table,
  Modal,
  Icon,
} from "semantic-ui-react";
import { API, graphqlOperation } from "aws-amplify";
import { createLevel, listLevels, deleteLevel, updateLevel } from "./_graphql";

const Level = () => {
  const [selected, setSelected] = useState("manage");
  const componentMap = {
    create: <CreateLevel />,
    manage: <ManageLevel />,
  };

  const renderButtons = () => {
    return (
      <>
        <Button.Group widths="2" style={{ paddingTop: "10px" }}>
          <Button
            toggle
            active={selected === "create"}
            onClick={() => setSelected("create")}
          >
            Create New Level
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage Levels
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

export default Level;

const CreateLevel = () => {
  const [levelName, setLevelName] = useState("");
  const [levelNum, setLevelNum] = useState("");
  const [createdLevel, setCreatedLevel] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createLevel, {
          input: {
            name: levelName,
            num: parseInt(levelNum),
          },
        })
      );
      setCreatedLevel(data.createLevel);
      console.log(data.createLevel);
    } catch (error) {
      console.error(error);
    }
  };

  const renderPreview = () => {
    if (Object.keys(createdLevel).length > 0) {
      const { id, name, num } = createdLevel;
      return (
        <Container style={{ paddingTop: "30px" }}>
          <Header as="h3">
            The following Level has been successfully created:
          </Header>
          <p>
            <b>ID</b>: {id}
          </p>
          <p>
            <b>Name</b>: {name}
          </p>
          <p>
            <b>Num</b>: {num}
          </p>
        </Container>
      );
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Level Name</label>
          <input
            placeholder="e.g. Primary 5"
            type="text"
            onChange={(e) => setLevelName(e.target.value)}
            value={levelName}
          />
        </Form.Field>
        <Form.Field>
          <label>Level Number</label>
          <input
            placeholder='e.g. "5"'
            type="number"
            onChange={(e) => setLevelNum(e.target.value)}
            value={levelNum}
          />
        </Form.Field>
        <Button fluid primary>
          Submit
        </Button>
      </Form>
      <Container>{renderPreview()}</Container>
    </>
  );
};

const ManageLevel = () => {
  const [levels, setLevels] = useState([]);
  const [activeLevel, selectActiveLevel] = useState({});
  const [editLevel, setEditLevel] = useState({ id: "", name: "", num: "" });
  const fetchLevels = async () => {
    const { data } = await API.graphql(graphqlOperation(listLevels));
    const levelArray = data.listLevels.items;
    levelArray.sort((a, b) => a.num - b.num);
    setLevels(levelArray);
  };
  useEffect(() => {
    fetchLevels();
  }, []);
  const renderLevels = () => {
    if (levels.length > 0) {
      return (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Level Name</Table.HeaderCell>
              <Table.HeaderCell>Level Num</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {levels.map((level) => {
              return renderLevel(level);
            })}
          </Table.Body>
        </Table>
      );
    }
  };
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const handleOpenDelete = (id, name, num) => {
    selectActiveLevel({ id, name, num });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => setModalDeleteOpen(false);
  const handleDeleteLevel = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteLevel, {
          input: { id: activeLevel.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setLevels(levels.filter((level) => level.id !== data.deleteLevel.id));
      }
      fetchLevels();
      setModalDeleteOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const renderDeleteLevelModal = (id, name, num) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenDelete(id, name, num)}>
            Delete
          </Button>
        }
        open={modalDeleteOpen}
        onClose={handleCloseDelete}
        size="small"
        centered={false}
      >
        <Header>Are you sure you want to delete the following Level?</Header>
        <Modal.Content>
          <p>ID: {activeLevel.id}</p>
          <p>Level Name: {activeLevel.name}</p>
          <p>Level Number: {activeLevel.num}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={handleDeleteLevel}>
            <Icon name="delete" /> Delete
          </Button>
          <Button secondary onClick={handleCloseDelete}>
            <Icon name="undo" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const handleOpenEdit = (id, name, num) => {
    selectActiveLevel({ id, name, num });
    setEditLevel({ id, name, num });
    setModalEditOpen(true);
  };
  const handleCloseEdit = () => setModalEditOpen(false);

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await API.graphql(
        graphqlOperation(updateLevel, {
          input: {
            id: editLevel.id,
            name: editLevel.name,
            num: parseInt(editLevel.num),
          },
        })
      );
      fetchLevels();
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderEditLevelModal = (id, name, num) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenEdit(id, name, num)}>Edit</Button>
        }
        open={modalEditOpen}
        onClose={handleCloseEdit}
        size="small"
        centered={false}
      >
        <Header>Edit Level</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Level Name</label>
              <input
                placeholder={activeLevel.name}
                type="text"
                onChange={(e) =>
                  setEditLevel({ ...editLevel, name: e.target.value })
                }
                value={editLevel.name}
              />
            </Form.Field>
            <Form.Field>
              <label>Level Number</label>
              <input
                placeholder='e.g. "5"'
                type="number"
                onChange={(e) =>
                  setEditLevel({ ...editLevel, num: e.target.value })
                }
                value={editLevel.num}
              />
            </Form.Field>
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

  const renderLevel = ({ id, name, num }) => {
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{num}</Table.Cell>
        <Table.Cell>
          {renderEditLevelModal(id, name, num)}
          {renderDeleteLevelModal(id, name, num)}
        </Table.Cell>
      </Table.Row>
    );
  };

  return <Container>{renderLevels()}</Container>;
};
