import React, { useState } from "react";
import { Container, Form } from "semantic-ui-react";
import { Auth } from "aws-amplify";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "../actions";
import { Redirect } from "react-router-dom";

const StaffLogin = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requireNewPassword, setRequireNewPassword] = useState(false);
  const [user, setUser] = useState({});
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      Auth.signIn(email, password).then((user) => {
        if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
          setUser(user);
          setRequireNewPassword(true);
        } else if (!user.challengeName) {
          console.log("User Object: ", user);
          console.log("User Attributes: ", user.attributes);
          dispatch(
            signIn({
              userID: user.attributes.sub,
              email: user.attributes.email,
            })
          );
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewPasswordSubmit = (event) => {
    event.preventDefault();
    try {
      Auth.completeNewPassword(user, password).then((user) => {
        dispatch(
          signIn({
            userID: user.username,
            email: user.challengeParam.userAttributes.email,
          })
        );
      });
    } catch (e) {
      console.error(e);
    }
  };

  const renderLoginForm = () => {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Email</label>
          <input
            placeholder="Enter your email address"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Form.Field>
        <Form.Group>
          <button className="ui fluid primary button">Submit</button>
        </Form.Group>
      </Form>
    );
  };

  const renderNewpasswordForm = () => {
    return (
      <Container>
        <Form onSubmit={handleNewPasswordSubmit}>
          <Form.Field>
            <label>New Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Field>
          <Form.Group>
            <button className="ui fluid primary button">Submit</button>
          </Form.Group>
        </Form>
      </Container>
    );
  };

  const renderStaffLogin = () => {
    if (requireNewPassword && !isSignedIn) {
      return renderNewpasswordForm();
    }
    if (!isSignedIn) {
      return renderLoginForm();
    }
    if (isSignedIn) {
      return <Redirect to="/dashboard" />;
    }
  };

  return <Container>{renderStaffLogin()}</Container>;
};

export default StaffLogin;
