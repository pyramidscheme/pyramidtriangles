import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import {SnackbarProvider} from "notistack";
import './index.css';
import App from './App';

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <App />
  </SnackbarProvider>,
  document.getElementById('root'));
