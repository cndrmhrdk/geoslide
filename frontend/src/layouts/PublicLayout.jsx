import { useState, createContext, useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './PublicLayout.css';

/**
 * NavbarContext
 * Memungkinkan halaman atau komponen anak (seperti HeroSection)
 * memilih mode navbar: 'solid' (default) atau 'overlay'.
 */
export const NavbarContext = createContext({
  variant: 'solid',
  setVariant: () => {},
});

export const useNavbarVariant = () => useContext(NavbarContext);

/**
 * PublicLayout — Layout utama halaman publik GeoSlide
 *
 * Menggunakan variant="solid" secara default. Halaman dengan HeroSection
 * atau foto sinematik dapat memanggil setVariant('overlay').
 */
export default function PublicLayout({ defaultVariant = 'solid' }) {
  const [variant, setVariant] = useState(defaultVariant);

  return (
    <NavbarContext.Provider value={{ variant, setVariant }}>
      <div className={`gs-layout gs-layout--${variant}`}>
        <Navbar variant={variant} />
        <main className="gs-layout__main">
          <Outlet context={{ variant, setVariant }} />
        </main>
        <Footer />
      </div>
    </NavbarContext.Provider>
  );
}
