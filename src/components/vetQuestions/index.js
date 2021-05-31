import React from "react";
import { Container, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const VetQuestions = () => {
  return (
    <Container style={{ paddingTop: "30px" }}>
      <Link to={"/vet-questions/vet-grammar-mcq"}>
        <Button size="large">Grammar MCQ</Button>
      </Link>
      <Link to={"/vet-questions/vet-vocab-mcq"}>
        <Button size="large">Vocabulary MCQ</Button>
      </Link>
    </Container>
  );
};

export default VetQuestions;
