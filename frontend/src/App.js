import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Sidebar from './components/sidebar/sidebar';

const App = () => {
  return (
    <Router>
      <div>
        <Sidebar />
        {/* <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Switch> */}
      </div>
    </Router>
  );
}

export default App;
