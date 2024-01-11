import { Routes, Route } from "react-router-dom";
import Index from "@pages/index";
import Layout from "@components/layout/index";
import About from "@pages/About";
import Dashboard from "@pages/Dashboard";
import NoMatch from "@pages/NoMatch";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="about" element={<About />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

