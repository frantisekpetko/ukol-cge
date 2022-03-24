import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import BitcoinDetail from './pages/BitcoinDetail';
import BitcoinTable from './pages/BitcoinTable';

function App() {
    return (
        <div className="App">
            
            <div>
                <Routes>
                    <Route path="/" element={<BitcoinTable />} />
                    <Route path="/detail/:symbol" element={<BitcoinDetail/>} />
                </Routes>
            </div>
        </div>
    );
}

export default App;

