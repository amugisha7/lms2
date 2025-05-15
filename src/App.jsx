import { Box, Button } from '@mui/material';
import './App.css';
// import Dashboard from './muiTemplates/dashboard/Dashboard';
import Onboarding from './Screens/Onboarding/Onboarding';
// import InputForm from './lmsComponents/form/InputForm';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  return (
    <>
      {/* <Box display={'flex'} justifyContent={'flex-end'} padding={2}>
        <h1>Hello {user.username}</h1>
        <Button onClick={signOut}>Sign out</Button>
      </Box> */}
      <Onboarding />
      
    </>
  );
}

export default withAuthenticator(App);