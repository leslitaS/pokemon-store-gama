import React from 'react';
import { BrowserRouter as Router, Switch, Route,} from "react-router-dom";
import Home from './pages/Home';
import Search from './pages/Search';
function App() {
  return (
    
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/search" exact component={Search} />
        </Switch>
      </Router>
     
  );
}

export default App;
