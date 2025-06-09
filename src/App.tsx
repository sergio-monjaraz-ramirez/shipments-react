import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "./components/NavBar"
import Client from "./pages/Client"
import Package from "./pages/Package"
import Shipment from "./pages/Shipment"
import Home from "./pages/Home"

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/packages" element={<Package />} />
        <Route path="/shipments" element={<Shipment />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
