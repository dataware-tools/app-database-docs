import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchApi, FetchStatus } from "@dataware-tools/app-common";
import { Button, Segment } from "semantic-ui-react";

const Sample = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [apiResult, setApiResult] = useState<any>(undefined);

  return (
    <div>
      <h1>Hello {user ? user.name : "world"}</h1>
      <Button
        className="TestAPIButton"
        onClick={() => {
          getAccessTokenSilently().then((accessToken: string) => {
            fetchApi("http://localhost:3000/", accessToken, setApiResult);
          });
        }}
      >
        Test API
      </Button>
      <FetchStatus {...apiResult} />
      {apiResult && apiResult.isFetchDone && (
        <Segment compact>{JSON.stringify(apiResult)}</Segment>
      )}
    </div>
  );
};

export default Sample;
