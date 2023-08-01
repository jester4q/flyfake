import { Routes, Route } from 'react-router-dom';
import 'moment/locale/ru';
import './app.scss';
import { Footer } from './footer';
import { Header } from './header';
import { Home } from './home';
import SvgIcons from './common/svg-icons/SvgIcons';
import Booking from './booking/Booking';
import Print from './print/Print';

function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/book" element={<Booking />} />
                <Route path="/print" element={<Print />} />
                <Route path="*" element={<Home />} />
            </Routes>
            <Footer />
            <SvgIcons />
        </>
    );
}

export default App;
