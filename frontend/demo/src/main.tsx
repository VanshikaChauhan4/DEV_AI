import React from 'react'; import { createRoot } from 'react-dom/client'; import SecretShield from '../../src/secret-shield/SecretShield';
function App(){return <SecretShield/>}; createRoot(document.getElementById('root')!).render(<App/>);
