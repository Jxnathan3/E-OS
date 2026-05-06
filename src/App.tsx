/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Tracker } from './pages/Tracker';
import { Analytics } from './pages/Analytics';
import { FocusMode } from './pages/FocusMode';
import { Profile } from './pages/Profile';
import { Goals } from './pages/Goals';
import { Journal } from './pages/Journal';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';

export default function App() {
  return (
    <GlobalErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="tracker" element={<Tracker />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="focus" element={<FocusMode />} />
            <Route path="goals" element={<Goals />} />
            <Route path="journal" element={<Journal />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalErrorBoundary>
  );
}
