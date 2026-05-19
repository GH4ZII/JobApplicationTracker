import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar.tsx";
import { ApplicationDetailPage } from "./pages/ApplicationDetailPage.tsx";
import { ApplicationFormPage } from "./pages/ApplicationFormPage.tsx";
import { ApplicationsListPage } from "./pages/ApplicationsListPage.tsx";
import { DashboardPage } from "./pages/DashboardPage.tsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/applications" element={<ApplicationsListPage />} />
          <Route path="/applications/new" element={<ApplicationFormPage />} />
          <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/:id/edit" element={<ApplicationFormPage />} />
        </Routes>
      </main>
    </div>
  );
}
