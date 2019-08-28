import * as React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import {library} from "@fortawesome/fontawesome-svg-core";

// Add all icons to the library so you can use it in your page
library.add(fas, far)
export const w = new WebSocket("ws://localhost:8889");
// w.addEventListener("message", m => console.log(JSON.parse(m.data)));

w.onopen = function() {
  ReactDOM.render(<App/>, document.getElementById('root'));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
