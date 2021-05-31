import React from "react";
import { Redirect, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "semantic-ui-react";

const Dashboard = (props) => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const userGroup = useSelector((state) => state.auth.group);

  if (!isSignedIn) {
    return <Redirect to="/" />;
  }

  const renderManageMeta = () => {
    return (
      <Link className="big primary fluid ui button link" to="/meta/">
        Manage Question Settings
      </Link>
    );
  };

  const renderManageQuestions = () => {
    return (
      <Link className="big primary fluid ui button" to="/questions/">
        Set and Edit Questions
      </Link>
    );
  };

  const renderManageDataEntry = () => {
    if (userGroup === "staff") {
      return (
        <Link className="big primary fluid ui button" to="/data-entry/">
          Manage Data Entry Questions
        </Link>
      );
    }
  };

  const renderVetQuestions = () => {
    if (userGroup === "staff") {
      return (
        <Link className="big primary fluid ui button" to="/vet-questions/">
          Vet Questions
        </Link>
      );
    }
  };

  return (
    <>
      <Container textAlign="center" style={{ paddingTop: "50px" }}>
        {renderManageQuestions()}
      </Container>

      <Container textAlign="center" style={{ paddingTop: "50px" }}>
        {renderManageMeta()}
      </Container>

      <Container textAlign="center" style={{ paddingTop: "50px" }}>
        {renderManageDataEntry()}
      </Container>

      <Container textAlign="center" style={{ paddingTop: "50px" }}>
        {renderVetQuestions()}
      </Container>
    </>
  );
};

export default Dashboard;
