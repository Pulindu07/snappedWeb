import { ReactionButton, CommentButton, ShareButton } from './components/Buttons';
import PhotoGallery from './components/PhotoGallery';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  return (
    <div className="App flex flex-col min-h-screen">
      {/* Header */}
      <Header />
      

      {/* Main Content */}
      <Main />

      {/* Footer */}
      <Footer />
      
    </div>
  );
}

export default App;
