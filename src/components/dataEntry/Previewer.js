import React from "react";
import { Menu, Icon, Header, Card, Container } from "semantic-ui-react";

const Previewer = (props) => {
  const { Component } = props;

  const renderComponent = () => {
    if (typeof Component !== "undefined") {
      return (
        <Container>
          <Component />
        </Container>
      );
    } else {
      return <Container>No valid Component in Props...</Container>;
    }
  };

  const renderIphoneNotch = () => {
    return (
      <Container textAlign="center">
        <Container
          textAlign="center"
          style={{
            borderStyle: "none solid solid solid",
            borderRadius: "5px",
            borderWidth: "1px",
            borderColor: "#000",
            height: "30px",
            width: "209px",
            margin: "0px",
            color: "#fff",
            backgroundColor: "#000",
          }}
        >
          iPhone Notch: 209px by 30px
        </Container>
      </Container>
    );
  };

  const renderTopMenu = () => {
    return (
      <Menu
        color="blue"
        inverted
        style={{ marginTop: "0px", marginBottom: "0px" }}
      >
        <Menu.Item name="home">
          <Icon name="home" />
        </Menu.Item>
        <Menu.Item name="title">
          <Header as="h3">AppName</Header>
        </Menu.Item>
      </Menu>
    );
  };

  const cardStyle = {
    width: "375px",
    height: "812px",
    borderColor: "#000",
    borderWidth: "8px",
    borderStyle: "solid",
    borderRadius: "15px",
  };

  return (
    <Card.Group centered>
      <Card style={cardStyle}>
        {renderIphoneNotch()}
        <Container style={{ overflow: "scroll" }}>
          {renderTopMenu()}
          {renderComponent()}
        </Container>
      </Card>
    </Card.Group>
  );
};

export default Previewer;
