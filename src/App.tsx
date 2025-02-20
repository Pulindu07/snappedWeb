
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // Import store
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App flex flex-col min-h-screen">
          {/* Header */}
          <Header />
          {/* Routes */}
          <Routes>
            <Route path={"/"} element={<Main />} />
          </Routes>
          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;


