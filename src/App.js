import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Alert from "./components/layout/Alert";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { LichessProvider } from "./contex/lichess/LichessContext";
import { AlertProvider } from "./contex/alert/AlertContext";

const App = () => {
  return (
    <LichessProvider>
      <AlertProvider>
        <Router>
          <div className="flex flex-col justify-between h-screen">
            <Navbar />

            <main className="container mx-auto px-3 pb-12">
              <Alert />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/notFound" element={<NotFound />} />
                <Route path="/*" element={<NotFound />} />
              </Routes>
            </main>

            {<Footer />}
          </div>
        </Router>
      </AlertProvider>
    </LichessProvider>
  );
};

Footer();

export default App;
