import React from "react";
import { Container, Header } from "semantic-ui-react";
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../actions";

const TopMenu = () => {
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const userEmail = useSelector((state) => state.auth.email);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      dispatch(signOut());
    } catch (e) {
      console.error(e);
    }
  };
  const renderSignInSignOut = () => {
    if (isSignedIn) {
      return (
        <>
          <div className="item left">
            Signed in as&nbsp;<u>{userEmail}</u>.
          </div>
          <div className="item right">
            <div
              className="ui button item"
              onClick={handleSignOut}
              type="button"
            >
              <b>Sign Out&nbsp;&nbsp;</b>
              <i className="sign out icon" />
            </div>
          </div>
        </>
      );
    } else {
      return (
        <div className="item right">
          <div className="ui button item">
            <Link to="/login">
              <b>Sign In &nbsp;&nbsp;</b>
              <i className="sign in icon" />
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <Container>
      <div className="ui blue inverted borderless top fixed menu">
        <Link className="item" to="/">
          <i className="home icon large" />
        </Link>
        <Link to="/" className="item header">
          <Header style={{ color: "#fff" }}>Cupcake Mission Control</Header>
        </Link>
        {renderSignInSignOut()}
      </div>
    </Container>
  );
};

export default TopMenu;
