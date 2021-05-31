import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Header, Segment } from "semantic-ui-react";
import ScienceMCQ from "./ScienceMCQ";
// import ScienceOpenEnded from "./ScienceOpenEnded";
// import ScienceLabelling from "./ScienceLabelling";
import LinkedScienceMCQ from "./LinkedScienceMCQ";

const CountScienceQuestions = (props) => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const scienceComponentsMap = {
    "Science MCQ": <ScienceMCQ />,
    "Linked Science MCQ (with shared preamble)": <LinkedScienceMCQ />,
    // "Science Open Ended Questions": <ScienceOpenEnded />,
    // "Science Labelling Questions": <ScienceLabelling />,
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

export default CountScienceQuestions;
