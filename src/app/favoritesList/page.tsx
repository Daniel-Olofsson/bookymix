"use client";
import React, { useState, useEffect } from "react";
import { useFavorites } from "../context/favoriteContext"; // Importera contexten
import styled from "styled-components";
import Link from "next/link";

const FavoritesList = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [isClient, setIsClient] = useState(false); // State to track if it's client-side

  useEffect(() => {
    setIsClient(true); // Set to true after mount
  }, []);

  if (!isClient) {
    return null; // Prevent rendering on the server, wait until client is ready
  }

  if (favorites.length === 0) {
    return <NoFavoritesText>No favorites yet!</NoFavoritesText>;
  }

  return (
    <FavoritesContainer>
      <Link href="/" passHref>
        <HomeLink>Back to Homepage</HomeLink>
      </Link>
      <h2>Your Favorites</h2>
      {favorites.map((book) => (
        <FavoriteItem key={book.key}>
          <BookInfo>
            <BookTitle>{book.title}</BookTitle>
            {book.authors && book.authors.length > 0 && (
              <AuthorNames>
                {book.authors.map((a) => a.author.key).join(", ")}
              </AuthorNames>
            )}
          </BookInfo>
          <RemoveButton onClick={() => removeFavorite(book)}>
            Remove from Favorites
          </RemoveButton>
        </FavoriteItem>
      ))}
    </FavoritesContainer>
  );
};

// Styled components

const FavoritesContainer = styled.div`
  color: white;
  padding: 20px;
  background-color: #333;
  min-height: 100vh;
`;

const FavoriteItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #444;
  border-radius: 5px;
`;

const BookInfo = styled.div`
  max-width: 70%;
`;

const BookTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const AuthorNames = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #bbb;
`;

const RemoveButton = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

const NoFavoritesText = styled.p`
  font-size: 1.5rem;
  color: #bbb;
  text-align: center;
`;

const HomeLink = styled.div`
  color: #d9534f;
  font-size: 1.2rem;
  text-decoration: none;
  margin-bottom: 20px;

  &:hover {
    text-decoration: underline;
  }
`;

export default FavoritesList;
