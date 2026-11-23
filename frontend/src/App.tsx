import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ProgressProvider, useProgress } from './lib/progress';
import TopBar from './components/TopBar';
import Login from './pages/Login';
import MapPage from './pages/MapPage';
import HousePage from './pages/HousePage';
import TopicPage from './pages/TopicPage';

function Shell() {
  const { p } = useProgress();
  if (!p.name) return <Login />;
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/house/:houseId" element={<HousePage />} />
        <Route path="/topic/:topicId" element={<TopicPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    // reducedMotion="user" respects the OS setting — kinder to slow lab PCs
    <MotionConfig reducedMotion="user">
      <ProgressProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </ProgressProvider>
    </MotionConfig>
  );
}
