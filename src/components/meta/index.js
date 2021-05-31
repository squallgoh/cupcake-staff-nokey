import React, { useState } from "react";
import { Grid, Menu, Segment } from "semantic-ui-react";
import Level from "./Level";
import Topic from "./Topic";
import QuestionType from "./QuestionType";
import Subject from "./Subject";
import SkillGroup from "./SkillGroup";
import Skill from "./Skill";
import SubSkill from "./SubSkill";

const Meta = () => {
  const optionsMap = {
    Level: <Level />,
    Topic: <Topic />,
    QuestionType: <QuestionType />,
    Subject: <Subject />,
    SkillGroup: <SkillGroup />,
    Skill: <Skill />,
    SubSkill: <SubSkill />,
  };

  const [activeItem, setActiveItem] = useState("QuestionType");
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };
  const renderLeftMenu = () => {
    return (
      <Grid.Column width={4}>
        <Menu fluid vertical tabular color="blue">
          <Menu.Item
            name="Level"
            active={activeItem === "Level"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="Subject"
            active={activeItem === "Subject"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="QuestionType"
            active={activeItem === "QuestionType"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="Topic"
            active={activeItem === "Topic"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="SkillGroup"
            active={activeItem === "SkillGroup"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="Skill"
            active={activeItem === "Skill"}
            onClick={handleItemClick}
          />
          <Menu.Item
            name="SubSkill"
            active={activeItem === "SubSkill"}
            onClick={handleItemClick}
          />
        </Menu>
      </Grid.Column>
    );
  };

  const renderRightDisplay = () => {
    const selectedComponent = optionsMap[activeItem];
    return (
      <Grid.Column stretched width={12}>
        <Segment>{selectedComponent}</Segment>
      </Grid.Column>
    );
  };

  return (
    <Grid>
      {renderLeftMenu()}
      {renderRightDisplay()}
    </Grid>
  );
};

export default Meta;
