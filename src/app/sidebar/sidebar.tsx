"use client";
import React from "react";
import styles from "../../styles/sidebar.module.css";
import Link from "next/link";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <button className={styles.closeButton} onClick={toggleSidebar}>
        ✖
      </button>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <div className={styles.searchContainer}>
          <input
            className={styles.searchInput}
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search for books"
          />
          <button className={styles.searchButton} type="submit">
            Search
          </button>
        </div>
      </form>

      <ul className={styles.sidebarMenu}>
        <Link href="/about">About</Link>
        <Link href="/favoritesList">Favorites</Link>
      </ul>
    </div>
  );
};

export default Sidebar;
