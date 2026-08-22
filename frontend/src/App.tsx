import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TopicsSection from "./components/TopicsSection";
import AskHealthSection from "./components/AskHealthSection";
import LatestArticles from "./components/LatestArticles";
import ArticlesPage from "./pages/ArticlesPage";
import ArticleDetailsPage from "./pages/ArticleDetailsPage";
import AskHealthPage from "./pages/AskHealthPage";
import TopicsPage from "./pages/TopicsPage";


function Home() {
  return (
    <>
      <Hero />
      <TopicsSection />
      <AskHealthSection />
      <LatestArticles />
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailsPage />} />
        <Route path="/ask" element={<AskHealthPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;