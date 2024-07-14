import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { UserProvider } from './utils/UserContext';
import { setAxiosAuthToken, getAuthToken } from './auth/auth.js';

import App from './App.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const authToken = getAuthToken();
setAxiosAuthToken(authToken);

ReactDOM.createRoot(document.getElementById('root')).render(
    /*<React.StrictMode>*/
    <BrowserRouter>
        <UserProvider>
            <App />
        </UserProvider>
    </BrowserRouter>,
    /*</React.StrictMode>*/
);
