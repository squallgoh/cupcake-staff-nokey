import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Header, Segment } from "semantic-ui-react";
import MathMCQ from "./MathMCQ";
import MathShortAnswers from "./MathShortAnswers";

const MathQuestions = (props) => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const scienceComponentsMap = {
    "Math MCQ": <MathMCQ />,
    "Math Short Answer Questions": <MathShortAnswers />,
  };

  const [activeItem, setActiveItem] = useState("");
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  const renderOptions = () => {
    return Object.keys(scienceComponentsMap).map((key) => {
      return (
        <Button
          key={key}
          onClick={handleItemClick}
          name={key}
          toggle
          active={activeItem === key}
        >
          {key}
        </Button>
      );
    });
  };

  if (!isSignedIn) {
    return <Redirect to="/" />;
  }

  const renderSubComponent = () => {
    const selectedComponent = scienceComponentsMap[activeItem];
    return <>{selectedComponent}</>;
  };

  return (
    <Container>
      <Container>
        <Header>Select the Question Type:</Header>
        {renderOptions()}
      </Container>
      <Segment>{renderSubComponent()}</Segment>
    </Container>
  );
};

export default MathQuestions;
