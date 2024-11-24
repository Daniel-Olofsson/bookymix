"use client";
import React, { useState } from "react";
import styles from "../../styles/navbar.module.css";
import Sidebar from "../sidebar/sidebar";
import Link from "next/link";

type NavbarProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
};

const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <div className={styles.icon}>
          <Link href="/">
            <img src="/images/icon.jpg" alt="icon" className="icon" />
          </Link>
        </div>
        <button className={styles.menuButton} onClick={toggleSidebar}>
          ☰
        </button>
      </nav>

      {sidebarOpen && (
        <Sidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
        />
      )}
    </div>
  );
};

export default Navbar;
