import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Container, Divider, Menu } from "semantic-ui-react";
import { repository } from "../package.json";

export const Header = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  return (
    <div className="Header">
      <br />
      <Menu stackable inverted>
        <Menu.Item color="blue" active>
          <a href="/">Dataware Tools</a>
        </Menu.Item>
        {!isAuthenticated ? (
          <Menu.Item
            position="right"
            onClick={() => {
              loginWithRedirect({
                redirect_uri: window.location.href,
              });
            }}
          >
            Login
          </Menu.Item>
        ) : (
          <Menu.Item
            position="right"
            onClick={() => {
              logout({ returnTo: window.location.origin });
            }}
          >
            Logout
          </Menu.Item>
        )}
      </Menu>
      <br />
    </div>
  );
};

export const Footer = () => {
  return (
    <div className="Footer">
      <br />
      <Divider />
      <Menu text size="mini">
        <Menu.Item color="blue">
          &copy;{" "}
          <a
            href="http://www.hdwlab.co.jp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Human Dataware Lab.
          </a>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <a href={repository}>GitHub</a>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
};

export type PageWrapperProps = {
  children: any;
};

export const PageWrapper = (props: PageWrapperProps) => {
  const { isLoading, error } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }
  return (
    <Container>
      <Header />
      {props.children}
      <Footer />
    </Container>
  );
};
