import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Header } from "semantic-ui-react";
import { listSubjects } from "./_graphql";
import { API, graphqlOperation } from "aws-amplify";

const DataEntry = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const [subjects, setSubjects] = useState([]);
  const fetchSubjects = async () => {
    try {
      const { data } = await API.graphql(graphqlOperation(listSubjects));
      const subjectArray = data.listSubjects.items;
      subjectArray.sort((a, b) => (a.name < b.name ? -1 : 1));
      setSubjects(subjectArray);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);
  if (!isSignedIn) {
    return <Redirect to="/" />;
  }
  const renderSubjects = () => {
    if (subjects.length > 0) {
      return subjects.map((subject) => {
        return (
          <Container key={subject.id} style={{ paddingTop: "30px" }}>
            <Link to={`/data-entry/${subject.name.toLowerCase()}`}>
              <Button primary fluid size="large">
                {subject.name}
              </Button>
            </Link>
          </Container>
        );
      });
    }
  };

  return (
    <Container>
      <Container textAlign="center" style={{ paddingTop: "30px" }}>
        <Header>Select the Subject to Set or Edit Questions</Header>
      </Container>
      <Container textAlign="center">{renderSubjects()}</Container>
    </Container>
  );
};

export default DataEntry;
