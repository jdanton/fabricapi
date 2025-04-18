import React, { useState } from "react";
import { PageLayout } from './components/PageLayout';
import { ProfileData } from './components/ProfileData';
import { loginRequest, msalConfig } from "./authConfig";
import { MsalProvider, AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useAccount } from "@azure/msal-react";
import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import Button from "react-bootstrap/Button";
import "./styles/App.css";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);



// Component that handles API interaction
const MainContent = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [graphqlData, setGraphqlData] = useState(null);

  const callFabricApi = async () => {
    const endpoint = 'https://cfaffbb9d0f34852b9b9e85b2402aa17.zcf.graphql.fabric.microsoft.com/v1/workspaces/cfaffbb9-d0f3-4852-b9b9-e85b2402aa17/graphqlapis/9edc6232-1843-405f-9bde-6a4c4ed49dc8/graphql';
    
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account
      });

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${response.accessToken}`
      };

      const query = `
          query {
              factInternetSales(
                filter: {
                  TotalProductCost: { gt: 1000 }
                }
              ) {
                items {
                  ProductKey
                  TotalProductCost
                  SalesOrderNumber
                }
              }
          }`;

      const apiResponse = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ query })
      });

      const data = await apiResponse.json();
      setGraphqlData(data);
    } catch (error) {
      console.error("Error calling Fabric API:", error);
      if (error instanceof InteractionRequiredAuthError) {
        instance.acquireTokenRedirect(loginRequest);
      }
    }
  };

  return (
    <div className="App">
      <AuthenticatedTemplate>
        {graphqlData ? (
          <ProfileData graphqlData={graphqlData} />
        ) : (
          <Button variant="primary" onClick={callFabricApi}>
            Call Fabric API
          </Button>
        )}
      </AuthenticatedTemplate>
      
      <UnauthenticatedTemplate>
        <p>You need to sign in to use this application.</p>
      </UnauthenticatedTemplate>
    </div>
  );
};

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </MsalProvider>
  );
}

export default App;