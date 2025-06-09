import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
// Layout Components
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ChatbotWidget } from "./components/common/ChatbotWidget";

// Pages
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { ContactPage } from "./pages/ContactPage";
import { SignUpPage } from "./pages/SignUpPage";
import { LoginPage } from "./pages/LoginPage";
import { SubmitIdeaPage } from "./pages/SubmitIdeaPage";
import { EntrepreneurDashboardPage } from "./pages/EntrepreneurDashboardPage";
import { InvestorDashboardPage } from "./pages/InvestorDashboardPage";
import { RankedIdeasPage } from "./pages/RankedIdeasPage";
import { IdeaDetailsPage } from "./pages/IdeaDetailsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useDispatch } from "react-redux";
import { fetchMe } from "./redux/slices/authSlice";
import DiscoverIdeas from "./pages/InvesterDashbord/DiscoverIdeas";
import Profile from "./pages/InvesterDashbord/ProfilePage";
import MyIdeas from "./pages/Enterpreneur Dashboard/MyIdeas";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/submit-idea" element={<SubmitIdeaPage />} />
              <Route
                path="/entrepreneur-dashboard"
                element={<EntrepreneurDashboardPage />}
              >
                <Route path="" element={<MyIdeas />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route
                path="/investor-dashboard"
                element={<InvestorDashboardPage />}
              >
                <Route path="" element={<DiscoverIdeas />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="/ranked-ideas" element={<RankedIdeasPage />} />
              <Route path="/ideas/:id" element={<IdeaDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <ChatbotWidget />
        </div>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
