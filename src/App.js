import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import { BrowserRouter, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Auth } from "aws-amplify";

import LandingPage from "./components/LandingPage";
import StaffLogin from "./components/StaffLogin";
import TopMenu from "./components/TopMenu";
import { signIn } from "./actions";
import Dashboard from "./components/Dashboard";
import Meta from "./components/meta";
import Questions from "./components/questions";
import EnglishQuestions from "./components/questions/English";
import ScienceQuestions from "./components/questions/Science";
import MathQuestions from "./components/questions/Mathematics";

import DataEntry from "./components/dataEntry";
import CountEnglishQuestions from "./components/dataEntry/English";
import CountMathQuestions from "./components/dataEntry/Mathematics";
import CountScienceQuestions from "./components/dataEntry/Science";

import VetQuestions from "./components/vetQuestions";
import VetGrammarMCQ from "./components/vetQuestions/VetGrammarMCQ";
import VetVocabMCQ from "./components/vetQuestions/VetVocabMCQ";

const App = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        if (Object.keys(user).length > 0) {
          dispatch(
            signIn({
              userID: user.attributes.sub,
              email: user.attributes.email,
              group:
                user.signInUserSession.accessToken.payload["cognito:groups"][0],
            })
          );
        }
        return user;
      } catch (e) {
        if (e !== "not authenticated") {
          console.error(e);
        }
      }
    };
    fetchUser();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Container>
        <TopMenu />
      </Container>
      <Container style={{ paddingTop: "60px" }}>
        <Route path="/" exact component={LandingPage} />
        <Route path="/login" component={StaffLogin} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/meta/" exact component={Meta} />
        <Route path="/questions/" exact component={Questions} />
        <Route path="/questions/english" exact component={EnglishQuestions} />
        <Route path="/questions/science" exact component={ScienceQuestions} />
        <Route path="/questions/mathematics" exact component={MathQuestions} />

        <Route path="/data-entry/" exact component={DataEntry} />
        <Route
          path="/data-entry/english"
          exact
          component={CountEnglishQuestions}
        />
        <Route
          path="/data-entry/mathematics"
          exact
          component={CountMathQuestions}
        />
        <Route
          path="/data-entry/science"
          exact
          component={CountScienceQuestions}
        />

        <Route path="/vet-questions/" exact component={VetQuestions} />
        <Route
          path="/vet-questions/vet-grammar-mcq"
          exact
          component={VetGrammarMCQ}
        />

        <Route
          path="/vet-questions/vet-vocab-mcq"
          exact
          component={VetVocabMCQ}
        />
      </Container>
    </BrowserRouter>
  );
};

export default App;
