import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Header,
  Table,
  Modal,
  Icon,
  List,
} from "semantic-ui-react";
import { API, graphqlOperation } from "aws-amplify";
import {
  createSubject,
  listSubjects,
  deleteSubject,
  updateSubject,
  listLevels,
  createLevelSubject,
  deleteLevelSubject,
  getSubject,
} from "./_graphql";

const Subject = () => {
  const [selected, setSelected] = useState("manage");
  const [levels, setLevels] = useState([]);
  const componentMap = {
    create: <CreateSubject levels={levels} />,
    manage: <ManageSubject />,
  };
  const fetchLevels = async () => {
    const { data } = await API.graphql(graphqlOperation(listLevels));
    const levelArray = data.listLevels.items;
    levelArray.sort((a, b) => a.num - b.num);
    setLevels(levelArray);
  };
  useEffect(() => {
    fetchLevels();
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
            Create New Subject
          </Button>
          <Button
            toggle
            active={selected === "manage"}
            onClick={() => setSelected("manage")}
          >
            Manage Subjects
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

export default Subject;

const CreateSubject = (props) => {
  const [subjectName, setSubjectName] = useState("");
  const [longName, setLongName] = useState("");
  const [createdSubject, setCreatedSubject] = useState({});
  const [associatedLevels, setAssociatedLevels] = useState("");
  const { levels } = props;

  const fetchSubject = async (subjectID) => {
    const { data } = await API.graphql(
      graphqlOperation(getSubject, { id: subjectID })
    );
    setCreatedSubject(data.getSubject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.graphql(
        graphqlOperation(createSubject, {
          input: {
            name: subjectName,
            longName,
          },
        })
      );
      const subjectID = data.createSubject.id;
      associatedLevels.map(async (levelID) => {
        await API.graphql(
          graphqlOperation(createLevelSubject, {
            input: {
              levelID,
              subjectID,
            },
          })
        );
      });
      fetchSubject(subjectID);
    } catch (error) {
      console.error(error);
    }
  };

  const addLevel = (newLevel) => {
    if (!associatedLevels.includes(newLevel)) {
      setAssociatedLevels([...associatedLevels, newLevel]);
    }
  };

  const removeLevel = (newLevel) => {
    if (associatedLevels.includes(newLevel)) {
      const newLevels = associatedLevels.filter((level) => level !== newLevel);
      setAssociatedLevels(newLevels);
    }
  };

  const handleCheckbox = (e, data) => {
    const { checked, id: levelID } = data;
    if (checked) {
      addLevel(levelID);
    } else {
      removeLevel(levelID);
    }
  };

  const renderLevelSelections = () => {
    if (levels.length > 0) {
      return levels.map((level) => {
        return (
          <Form.Checkbox
            label={level.name}
            key={level.id}
            onChange={handleCheckbox}
            id={level.id}
          />
        );
      });
    }
  };

  const renderPreview = () => {
    if (Object.keys(createdSubject).length > 0) {
      const { id, name } = createdSubject;
      return (
        <Container style={{ paddingTop: "30px" }}>
          <Header as="h3">
            The following Subject has been successfully created:
          </Header>
          <p>
            <b>ID</b>: {id}
          </p>
          <p>
            <b>Name</b>: {name}
          </p>
        </Container>
      );
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Subject Name</label>
          <input
            placeholder="e.g. English"
            type="text"
            onChange={(e) => setSubjectName(e.target.value)}
            value={subjectName}
          />
        </Form.Field>
        <Form.Field>
          <label>Long Name</label>
          <input
            placeholder="e.g. Upper Primary English"
            type="text"
            onChange={(e) => setLongName(e.target.value)}
            value={longName}
          />
        </Form.Field>
        {renderLevelSelections()}
        <Button fluid primary>
          Submit
        </Button>
      </Form>
      <Container>{renderPreview()}</Container>
    </>
  );
};

const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [activeSubject, setActiveSubject] = useState({});
  const [editSubject, setEditSubject] = useState({
    id: "",
    name: "",
    levels: [],
  });
  const [associatedLevels, setAssociatedLevels] = useState("");
  const fetchSubjects = async () => {
    const { data } = await API.graphql(graphqlOperation(listSubjects));
    const subjectArray = data.listSubjects.items;
    subjectArray.sort((a, b) => (a.name > b.name ? -1 : 1));
    setSubjects(subjectArray);
  };
  useEffect(() => {
    fetchSubjects();
  }, []);
  const renderSubjects = () => {
    if (subjects.length > 0) {
      return (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell width={3}>ID</Table.HeaderCell>
              <Table.HeaderCell>Subject Name</Table.HeaderCell>
              <Table.HeaderCell>Long Name</Table.HeaderCell>
              <Table.HeaderCell>Levels Taught</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {subjects.map((subject) => {
              return renderSubject(subject);
            })}
          </Table.Body>
        </Table>
      );
    }
  };
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const handleOpenDelete = (id, name, levels) => {
    setActiveSubject({ id, name, levels });
    setModalDeleteOpen(true);
  };
  const handleCloseDelete = () => setModalDeleteOpen(false);
  const handleDeleteSubject = async () => {
    try {
      const { data } = await API.graphql(
        graphqlOperation(deleteSubject, {
          input: { id: activeSubject.id },
        })
      );
      if (Object.keys(data).length > 0) {
        setSubjects(
          subjects.filter((subject) => subject.id !== data.deleteSubject.id)
        );
      }
      setModalDeleteOpen(false);
      fetchSubjects();
    } catch (e) {
      console.error(e);
    }
  };

  const renderDeleteSubjectModal = (id, name, levels) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenDelete(id, name, levels)}>
            Delete
          </Button>
        }
        open={modalDeleteOpen}
        onClose={handleCloseDelete}
        size="small"
        centered={false}
      >
        <Header>Are you sure you want to delete the following Subject?</Header>
        <Modal.Content>
          <p>ID: {activeSubject.id}</p>
          <p>Subject Name: {activeSubject.name}</p>
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

  const [modalEditOpen, setModalEditOpen] = useState(false);
  const handleOpenEdit = (id, name, longName, levels) => {
    setActiveSubject({ id, name, longName, levels });
    setEditSubject({ id, name, longName, levels });
    let newLevels = [...associatedLevels];
    levels.forEach((level) => {
      if (!newLevels.includes(level.level.id)) {
        newLevels = [...newLevels, level.level.id];
      }
    });
    setAssociatedLevels(newLevels);
    setModalEditOpen(true);
  };
  const handleCloseEdit = () => {
    setModalEditOpen(false);
    setAssociatedLevels([]);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const data = await API.graphql(
        graphqlOperation(updateSubject, {
          input: {
            id: editSubject.id,
            name: editSubject.name,
            longName: editSubject.longName,
          },
        })
      );
      const subjectID = data.data.updateSubject.id;
      const dbLevels = data.data.updateSubject.levels.items.map((dbLevel) => {
        return dbLevel.level.id;
      });
      const newLevels = associatedLevels.filter(
        (level) => !dbLevels.includes(level)
      );
      const levelsToDelete = dbLevels.filter(
        (level) => !associatedLevels.includes(level)
      );
      const subjectLevelsToDelete = data.data.updateSubject.levels.items
        .filter((dbLevel) => levelsToDelete.includes(dbLevel.level.id))
        .map((newLevel) => newLevel.id);

      if (newLevels.length > 0) {
        newLevels.forEach(async (levelID) => {
          await API.graphql(
            graphqlOperation(createLevelSubject, {
              input: {
                levelID,
                subjectID,
              },
            })
          );
        });
      }
      if (subjectLevelsToDelete.length > 0) {
        subjectLevelsToDelete.forEach(async (id) => {
          await API.graphql(
            graphqlOperation(deleteLevelSubject, {
              input: {
                id,
              },
            })
          );
        });
      }
      fetchSubjects();
      setAssociatedLevels([]);
      setModalEditOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const renderLevelSelections = (levels) => {
    const addLevel = (newLevel) => {
      if (!associatedLevels.includes(newLevel)) {
        setAssociatedLevels([...associatedLevels, newLevel]);
      }
    };

    const removeLevel = (newLevel) => {
      if (associatedLevels.includes(newLevel)) {
        const newLevels = associatedLevels.filter(
          (level) => level !== newLevel
        );
        setAssociatedLevels(newLevels);
      }
    };

    const handleCheckbox = (e, data) => {
      const { checked, id: levelID } = data;
      if (checked) {
        addLevel(levelID);
      } else {
        removeLevel(levelID);
      }
    };
    if (levels.length > 0) {
      return levels.map(({ level }) => {
        return (
          <Form.Checkbox
            label={level.name}
            key={level.id}
            onChange={handleCheckbox}
            id={level.id}
            checked={associatedLevels.includes(level.id)}
          />
        );
      });
    }
  };

  const renderEditSubjectModal = (id, name, longName, levels) => {
    return (
      <Modal
        trigger={
          <Button onClick={() => handleOpenEdit(id, name, longName, levels)}>
            Edit
          </Button>
        }
        open={modalEditOpen}
        onClose={handleCloseEdit}
        size="small"
        centered={false}
      >
        <Header>Edit Subject</Header>
        <Modal.Content>
          <Form onSubmit={handleSubmitEdit}>
            <Form.Field>
              <label>Subject Name</label>
              <input
                placeholder={activeSubject.name}
                type="text"
                onChange={(e) =>
                  setEditSubject({ ...editSubject, name: e.target.value })
                }
                value={editSubject.name}
              />
            </Form.Field>
            <Form.Field>
              <label>Long Name</label>
              <input
                placeholder={activeSubject.longName}
                type="text"
                onChange={(e) =>
                  setEditSubject({ ...editSubject, longName: e.target.value })
                }
                value={editSubject.longName}
              />
            </Form.Field>
            {renderLevelSelections(levels)}
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

  const renderSubject = (subject) => {
    const { id, name, longName } = subject;
    const levels = subject.levels.items;
    levels.sort((a, b) => a.level.num - b.level.num);

    const renderLevelList = () => {
      const renderedLevels = levels.map(({ level }) => {
        return <List.Item key={level.id}>{level.name}</List.Item>;
      });
      return <List bulleted>{renderedLevels}</List>;
    };

    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{longName}</Table.Cell>
        <Table.Cell>{renderLevelList()}</Table.Cell>
        <Table.Cell>
          {renderEditSubjectModal(id, name, longName, levels)}
          {renderDeleteSubjectModal(id, name)}
        </Table.Cell>
      </Table.Row>
    );
  };

  return <Container>{renderSubjects()}</Container>;
};
