import ReactDOM from 'react-dom/client';
import App from './App.jsx'
import './index.css';
import { FronteggProvider } from '@frontegg/react';

const contextOptions = {
  baseUrl: 'https://app-qdz617i0xzvp.frontegg.com',
  clientId: '9016b273-500a-4e2d-aaa1-eef757e97a8d'
};

const authOptions = {
 // keepSessionAlive: true // Uncomment this in order to maintain the session alive
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <FronteggProvider 
    contextOptions={contextOptions} 
    hostedLoginBox={true}
    authOptions={authOptions}>
        <App />
    </FronteggProvider>,
   document.getElementById('root')
 );