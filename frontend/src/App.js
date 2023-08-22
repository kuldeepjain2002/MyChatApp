import "./App.css";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import ChatPage from "./pages/Chat";

function App() {
  return (
    <div className="App">
      {/* {console.log("welcome")}; */}
      <Route path="/" component={Homepage} exact />
      <Route path="/chat" component={ChatPage} />
    </div>
  );
}

export default App;
