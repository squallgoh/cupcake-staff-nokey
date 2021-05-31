import React from "react";
import { Container, Header } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  if (isSignedIn) {
    return <Redirect to="/dashboard" />;
  } else if (!isSignedIn) {
    return <Redirect to="/login" />;
  }

  return (
    <Container>
      <Header> Landing Page </Header>{" "}
    </Container>
  );
};

export default LandingPage;
