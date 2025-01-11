import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { ReactionButton, CommentButton, ShareButton } from './components/Buttons'
import PhotoGallery from './components/PhotoGallery'
import './App.css'

function App() {

  return (
    <div className="App">
      <div className="text-3xl font-bold text-blue-600">
        Hello world!!!
        <PhotoGallery imageUrl = 'test'/>
      </div>
    </div>
  )
}

export default App
