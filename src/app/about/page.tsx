"use client";
import React, { useReducer } from "react";
import Link from "next/link";
import styles from "../../styles/about.module.css";

const initialState = [
  {
    year: 2024,
    title: "Launch of BookyMix",
    showDetails: false,
    details:
      "BookyMix launched in 2024 with the aim of bringing together readers from all over the world. The platform offers book tracking, personalized recommendations, and more.",
  },
  {
    year: 2025,
    title: "Future Updates",
    showDetails: false,
    details:
      "BookyMix plans to introduce new features like community book clubs and advanced reading analytics to further enhance the user experience.",
  },
];

function reducer(state: any[], action: { type: string; index: number }) {
  switch (action.type) {
    case "TOGGLE_DETAILS":
      return state.map((item, i) =>
        i === action.index ? { ...item, showDetails: !item.showDetails } : item
      );
    default:
      return state;
  }
}

const About = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className={styles.aboutContainer}>
      <h1 className={styles.title}>About This Website</h1>
      <p className={styles.description}>
        Welcome to <strong>BookyMix</strong>, a platform designed to provide
        seamless book management and recommendations. Made by{" "}
        <strong>Daniel Olofsson</strong>
      </p>

      <div>
        <h2 className={styles.subtitle}>Key Features</h2>
        <ul className={styles.timeline}>
          {state.map((item, index) => (
            <li key={index}>
              <div className={styles.year}>{item.year}</div>
              <div className={styles.title}>{item.title}</div>
              <button
                onClick={() => dispatch({ type: "TOGGLE_DETAILS", index })}
              >
                {item.showDetails ? "Hide Details" : "Show Details"}
              </button>
              {item.showDetails && <p>{item.details}</p>}
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.links}>
        Check out our my profiles here:
        <br />
        <a
          href="https://www.linkedin.com/in/daniel-olofsson"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>{" "}
        |{" "}
        <a
          href="https://github.com/daniel-olofsson"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
      <p className={styles.footer}>
        <Link href="/">Back to Home</Link>
      </p>
    </div>
  );
};

export default About;
