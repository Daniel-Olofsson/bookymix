"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import BookGenre from "./bookGenre/bookGenre";
import Navbar from "./navbar/navbar";

export default function Home() {
  const [isSearchIsActive, setIsSearchIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setIsSearchIsActive(!!term);
  };

  const handleSearchSubmit = async () => {
    if (!searchTerm) return;

    console.log("Search submitted with term:", searchTerm);
    const formattedSearchTerm = searchTerm.replace(/\s+/g, "+");
    setLoading(true);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${formattedSearchTerm}`
      );
      const data = await response.json();
      if (data.docs && data.docs.length > 0) {
        const booksData = data.docs.map((book: any) => ({
          id: book.key,
          title: book.title,
          author: book.author_name
            ? book.author_name.join(", ")
            : "Unknown author",
          coverImage: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
            : "/default-cover.jpg",
        }));
        setBooks(booksData);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <header>
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </header>

      <main className={styles.main}>
        {!isSearchIsActive ? (
          <>
            <BookGenre genre={"science_fiction"} />
            <BookGenre genre={"fantasy"} />
            <BookGenre genre={"mystery"} />
            <BookGenre genre={"true_crime"} />
          </>
        ) : (
          <div className={styles.searchContainer}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
              </div>
            ) : (
              <div className={styles.booksList}>
                <h2 className={styles.searchResults}>
                  Search results for "{searchTerm}"
                </h2>
                {books.length > 0 ? (
                  books.map((book: any) => (
                    <div key={book.id} className={styles.bookItem}>
                      <h3>{book.title}</h3>
                      <p>{book.author}</p>
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="bookImage"
                      />
                    </div>
                  ))
                ) : (
                  <h1 className={styles.noResults}>
                    Press enter or search button
                  </h1>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
