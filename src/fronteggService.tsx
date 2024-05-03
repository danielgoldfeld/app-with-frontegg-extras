// fronteggService.tsx

async function authenticateVendor() {
  const response = await fetch('https://api.frontegg.com/auth/vendor/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Noamikon's Creds:
      // clientId: '14d8d149-4b8d-47a3-afbd-9329da12390d',
      // secret: '053cc7dd-5e6c-403f-9922-4063a99559c8'
      clientId: 'efdf5e24-312f-4874-810c-d1e2fbed955a',
      secret: '4377ab83-6314-4650-b7b7-60055c0b4161'
    }),
  });

  if (!response.ok) {
    throw new Error('Vendor authentication failed');
  }

  const data = await response.json();
  return data.token; // Assuming the token is returned in the 'token' field
}

async function fetchTenantNames(tenantIds) {
  try {
    const jwtToken = await authenticateVendor();
    const tenantNames = {};

    const tenantFetchPromises = tenantIds.map(async (tenantId) => {
      const response = await fetch(`https://api.frontegg.com/tenants/resources/tenants/v1/${tenantId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        },
      });

      if (response.ok) {
        const tenantData = await response.json();
        tenantNames[tenantId] = tenantData.name;
      } else {
        console.error(`Failed to fetch data for tenant ID: ${tenantId}`);
      }
    });

    await Promise.all(tenantFetchPromises);
    return tenantNames;
  } catch (error) {
    console.error('Error in fetchTenantNames:', error);
    throw error;
  }
}

export { authenticateVendor, fetchTenantNames };
