"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";
import { useFavorites } from "../../../context/favoriteContext"; // Importera contexten

type Book = {
  key: string;
  title: string;
  authors?: { author: { key: string } }[];
  description?: string;
  published_date?: string;
  subjects?: string[];
  covers?: number[];
};

type Author = {
  name: string;
};

type AuthorObj = {
  author: { key: string };
};

const BookDetails = () => {
  const { id } = useParams();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [book, setBook] = useState<Book | null>(null);
  const [authorsNames, setAuthorsNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;

      try {
        const res = await fetch(`https://openlibrary.org/works/${id}.json`);
        if (!res.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await res.json();
        setBook(data);

        if (data.authors) {
          const authorPromises = data.authors.map(
            async (authorObj: AuthorObj) => {
              const authorRes = await fetch(
                `https://openlibrary.org${authorObj.author.key}.json`
              );
              const authorData: Author = await authorRes.json();
              return authorData.name;
            }
          );
          const authors = await Promise.all(authorPromises);
          setAuthorsNames(authors);
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    if (book) {
      const favoriteStatus = favorites.some(
        (favorite) => favorite.key === book.key
      );
      setIsFavorite(favoriteStatus);
    }
  }, [favorites, book]);

  const handleFavoriteToggle = () => {
    if (!book) return;

    if (isFavorite) {
      removeFavorite(book);
    } else {
      addFavorite(book);
    }

    setIsFavorite((prev) => !prev);
  };

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <ErrorText>Error: {error}</ErrorText>;
  if (!book) return <ErrorText>No book found</ErrorText>;

  return (
    <Container>
      <BackLink href="/">Back to Home</BackLink>
      <BookTitle>{book.title}</BookTitle>
      {book.covers && book.covers.length > 0 && (
        <BookImage
          src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
          alt={book.title}
        />
      )}
      <h3>Author: {authorsNames.join(", ")}</h3>
      <p>Published Date: {book.published_date}</p>
      <p>Description: {book.description}</p>
      <FavoriteButton onClick={handleFavoriteToggle}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </FavoriteButton>
    </Container>
  );
};

// Styled components

const BackLink = styled(Link)`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  font-size: 1.2rem;
  text-decoration: none;
  border-radius: 5px;
  margin-bottom: 20px;
  display: inline-block;

  &:hover {
    background-color: #0056b3;
  }
`;

const Container = styled.div`
  background-color: #000000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  color: white;

  height: 100vh;
`;

const BookTitle = styled.h1`
  margin-left: auto;
  margin-right: auto;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 20px;
`;

const BookImage = styled.img`
  max-width: 500px;
  height: auto;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
`;

const LoadingText = styled.p`
  font-size: 1.5rem;
  color: #888;
`;

const ErrorText = styled.p`
  font-size: 1.5rem;
  color: red;
`;

const FavoriteButton = styled.button`
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  margin-top: 20px;

  &:hover {
    background-color: #218838;
  }
`;

export default BookDetails;
