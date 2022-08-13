import './App.css'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import MainApp from './MainApp';
import {
  BrowserRouter,
} from "react-router-dom";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
