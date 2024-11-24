import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "../../styles/book_genre.module.css";

type Book = {
  title: string;
  cover_id?: string;
  key: string;
  author_name?: string[];
  description?: string;
  published_date?: string;
  subject?: string[];
};

type BookGenreProps = {
  genre: string;
};

const BookGenre: React.FC<BookGenreProps> = ({ genre }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `https://openlibrary.org/subjects/${genre}.json?offset=${
            (page - 1) * 100
          }`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks((prevBooks) => [...prevBooks, ...data.works]);
        setHasMore(data.works.length === 100);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [genre, page]);

  const formattedGenre = genre.replace(/_/g, " ");

  if (loading && page === 1)
    return (
      <p className={styles.loading}>
        Loading{" "}
        {formattedGenre.charAt(0).toUpperCase() + formattedGenre.slice(1)}{" "}
        books...
      </p>
    );
  if (error) return <p>Error: {error}</p>;

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const loadMoreAndScrollRight = () => {
    setPage((prevPage) => prevPage + 1);
    scrollRight();
  };

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.genreTitle}>
        {formattedGenre.charAt(0).toUpperCase() + formattedGenre.slice(1)} Books
      </h1>
      <div className={styles.container}>
        <button
          className={`${styles.scrollButtonLeft} ${styles.scrollButton}`}
          onClick={scrollLeft}
        >
          &lt;
        </button>

        <div ref={scrollContainerRef} className={styles.bookContainer}>
          {books.map((book, index) => {
            return (
              <div key={index} className={styles.bookItem}>
                <Link
                  href={{
                    pathname: `/book/${book.key}`,
                  }}
                >
                  <img
                    src={`https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`}
                    alt={book.title}
                    className={styles.bookImage}
                  />
                  <div className={styles.bookTitle}>{book.title}</div>
                </Link>
              </div>
            );
          })}
        </div>

        <button
          className={`${styles.scrollButtonRight} ${styles.scrollButton}`}
          onClick={loadMoreAndScrollRight}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default BookGenre;
