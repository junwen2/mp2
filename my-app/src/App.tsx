import './App.css';
import { NavLink, Route, Routes } from 'react-router-dom';
import React from 'react';
import { BrowseProvider } from './BrowseContext';
import ListView from './views/ListView';
import GalleryView from './views/GalleryView';
import DetailView from './views/DetailView';
import styles from './App.module.css';

function Home() {
  return (
    <div className={styles.home}>
      <h1>Pokédex</h1>
      <p>Choose a view:</p>
      <nav className={styles.nav}>
        <NavLink to="/list">List</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowseProvider>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:name" element={<DetailView />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </BrowseProvider>
  );
}

export default App;
