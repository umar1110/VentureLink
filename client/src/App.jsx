import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext";
// Layout Components
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";

// Pages
import { useDispatch, useSelector } from "react-redux";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import MessagesPage from "./pages/Enterpreneur Dashboard/Messages";
import MyIdeas from "./pages/Enterpreneur Dashboard/MyIdeas";
import { EntrepreneurDashboardPage } from "./pages/EntrepreneurDashboardPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { IdeaDetailsPage } from "./pages/IdeaDetailsPage";
import DiscoverIdeas from "./pages/InvesterDashbord/DiscoverIdeas";
import Profile from "./pages/InvesterDashbord/ProfilePage";
import { InvestorDashboardPage } from "./pages/InvestorDashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SignUpPage } from "./pages/SignUpPage";
import { SubmitIdeaPage } from "./pages/SubmitIdeaPage";
import { fetchMe } from "./redux/slices/authSlice";
import { socket } from "./socket";

function App() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      // socket.connect(); // 🔌 Connect socket
      socket.emit("addUser", user._id); // 👤 Register as online
    }

    return () => {
      if (socket.connected) {
        socket.disconnect(); // cleanup on unmount or logout
      }
    };
  }, [user?._id]);
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
                <Route path="messages" element={<MessagesPage />} />
                {/* <Route path="submit-idea" element={<SubmitIdeaPage />} /> */}
              </Route>
              <Route
                path="/investor-dashboard"
                element={<InvestorDashboardPage />}
              >
                <Route path="" element={<DiscoverIdeas />} />
                <Route path="profile" element={<Profile />} />
                <Route path="messages" element={<MessagesPage />} />s{" "}
              </Route>
              {/* <Route path="/ranked-ideas" element={<RankedIdeasPage />} /> */}
              <Route path="/ideas/:id" element={<IdeaDetailsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          {/* <ChatbotWidget /> */}
        </div>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
