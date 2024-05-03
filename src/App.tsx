import './App.css';
import { useEffect, useState } from 'react';
import { useAuth, useAuthActions, useLoginWithRedirect, ContextHolder, AdminPortal } from "@frontegg/react";
import { fetchTenantNames } from './fronteggService'; // Import the function from Noamikon

function App() {
  const { user, isAuthenticated } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  const { switchTenant } = useAuthActions();
  const [tenantNames, setTenantNames] = useState({});
  const [selectedTenant, setSelectedTenant] = useState('');

  // Onload actions including fetching all active tenants from ./fronteggService using API calls if user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenantNames(user?.tenantIds || [])
        .then(names => setTenantNames(names))
        .catch(error => console.error('Failed to fetch tenant names:', error));
    } else {
      loginWithRedirect();
    }
    }, [isAuthenticated, user?.tenantIds, loginWithRedirect]);
  
  // Switch between tenants when tenant is selected in the Select dropdown
  const handleSwitchTenant = (tenantId) => {
    switchTenant({ tenantId });
    setSelectedTenant(tenantId);
  };

  // Trigger logout (terminate session and revoke token)
  const logout = () => {
    const baseUrl = ContextHolder.getContext().baseUrl;
    window.location.href = `${baseUrl}/oauth/logout?post_logout_redirect_uri=${window.location}`;
  };

  // Load Admin Portal
  const handleClick = () => {
    AdminPortal.show();
  };

  return (
    <div className="App">
      { isAuthenticated ? (
        <div>
          <div>
            <img src={user?.profilePictureUrl} alt={user?.name}/>
          </div>
          <div>
            <span>Logged in as: {user?.name}</span>
          </div>
          <div>
            <button onClick={() => alert(user.accessToken)}>What is my access token?</button>
          </div>
          <div>
            <button onClick={handleClick}>Settings</button>
          </div>
          <div>
            <button onClick={() => logout()}>Click to logout</button>
          </div>
          <div>
            <label>
              Pick a Tenant:
            </label>
            <select 
              value={selectedTenant} 
              onChange={(e) => {
                setSelectedTenant(e.target.value);
                handleSwitchTenant(e.target.value);
              }}
            >
              {user?.tenantIds?.map((tenantId) => (
                <option key={tenantId} value={tenantId}>
                  {tenantNames[tenantId] || `Tenant ${tenantId}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => loginWithRedirect()}>Click me to login</button>
        </div>
      )}
    </div>
  );
}

export default App;