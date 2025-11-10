import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import RoutesTab from "./adapters/ui/components/RoutesTab";
import CompareTab from "./adapters/ui/components/CompareTab";
import BankingTab from "./adapters/ui/components/BankingTab";
import PoolingTab from "./adapters/ui/components/PoolingTab";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<RoutesTab />} />
            <Route path="/compare" element={<CompareTab />} />
            <Route path="/banking" element={<BankingTab />} />
            <Route path="/pooling" element={<PoolingTab />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function NavBar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Routes" },
    { path: "/compare", label: "Compare" },
    { path: "/banking", label: "Banking" },
    { path: "/pooling", label: "Pooling" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                location.pathname === item.path
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default App;

