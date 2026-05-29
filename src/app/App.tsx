import { BrowserRouter } from "react-router-dom";

import { AuthModal } from "../components/auth/AuthModal";
import { GlobalErrorModal } from "../components/error/GlobalErrorModal";
import RoutesComponent from "../routes/RoutesComponent";
import ScrollToTop from "../routes/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RoutesComponent />
      <AuthModal />
      <GlobalErrorModal />
    </BrowserRouter>
  );
}

export default App;
