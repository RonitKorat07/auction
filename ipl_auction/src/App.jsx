import { Outlet } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbbar';
function App() {
  return (
    <>
    <div className="min-h-screen bg-gray-100 w-full">
      <Navbar/>
<Outlet/>
    </div>
                    
                    </>
  );
}

export default App;
