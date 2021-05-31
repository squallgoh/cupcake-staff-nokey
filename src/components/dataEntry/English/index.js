import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Header, Segment } from "semantic-ui-react";
import GrammarMCQ from "./GrammarMCQ";
import VocabularyMCQ from "./VocabularyMCQ";
import VocabularyCloze from "./VocabularyCloze";
import VisualTextComprehension from "./VisualTextComprehension";
import GrammarCloze from "./GrammarCloze";
import ComprehensionCloze from "./ComprehensionCloze";

const CountEnglishQuestions = (props) => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const englishComponentsMap = {
    "Grammar MCQ": <GrammarMCQ />,
    "Vocabulary MCQ": <VocabularyMCQ />,
    "Vocabulary Cloze": <VocabularyCloze />,
    "Visual Text Comprehension": <VisualTextComprehension />,
    "Grammar Cloze": <GrammarCloze />,
    "Comprehension Cloze": <ComprehensionCloze />,
  };
  const [activeItem, setActiveItem] = useState("");
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  if (!isSignedIn) {
    return <Redirect to="/" />;
  }

  const renderOptions = () => {
    return Object.keys(englishComponentsMap).map((key) => {
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

  const renderSubComponent = () => {
    const selectedComponent = englishComponentsMap[activeItem];
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

export default CountEnglishQuestions;
