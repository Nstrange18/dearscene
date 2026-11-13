import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { MotionConfig } from 'motion/react';
import '@fontsource-variable/fraunces';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/manrope';
import './styles.css';
import { Layout } from './components/Layout';
import { Home, Gallery } from './pages/Discovery';
import { Create } from './pages/Create';
import { Editor } from './pages/Editor';
import { Missing, Viewer } from './pages/Viewer';
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(_error: Error, _info: ErrorInfo) { /* Never log draft content or local media. */ }
  render() { return this.state.failed ? <main className="container empty-state"><h1>This scene needs a fresh start.</h1><p>Your saved drafts are still in this browser.</p><button className="button button--fig" onClick={() => window.location.assign('/templates')}>Return to your stories</button></main> : this.props.children; }
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><ErrorBoundary><MotionConfig reducedMotion="user"><BrowserRouter><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="templates" element={<Gallery/>}/><Route path="create/:templateId" element={<Create/>}/><Route path="editor/:storyId" element={<Editor/>}/><Route path="preview/:storyId" element={<Viewer/>}/><Route path="s/:slug" element={<Viewer published/>}/><Route path="*" element={<Missing/>}/></Route></Routes></BrowserRouter></MotionConfig></ErrorBoundary></React.StrictMode>);
