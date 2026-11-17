'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './page.module.css';

type Vote = 'up' | 'down' | null;

const posts = [
  {
    author: 'EBATIN',
    time: '12 HOURS AGO',
    category: 'CAMPUS',
    title: 'ANY GOOD SPOTS IN CAMPUS TO STUDY?',
    excerpt: 'RANDOM TEXT TANDOM TEXT RANDOM TEXT RANDOM TEXT...',
    votes: 26,
    image: '/campusTag.png',
  },
  {
    author: 'TYLERGABRIELLASQUERO04',
    time: '2 HOURS AGO',
    category: 'OTHER',
    title: 'HOW CAN I JOIN UH ESPORTS?',
    excerpt: 'RANDOM TEXT TANDOM TEXT RANDOM TEXT RANDOM TEXT...',
    votes: 12,
    image: '/otherTag.png',
  },
  {
    author: 'RAFFY RIVERS',
    time: '19 MINUTES AGO',
    category: 'CLASSES',
    title: 'ANY GOOD RESOURCES FOR MATH?',
    excerpt: 'RANDOM TEXT TANDOM TEXT RANDOM TEXT RANDOM TEXT...',
    votes: 1,
    image: '/classTag.png',
  },
];

const ForumsPage = () => {
  const [selectedVotes, setSelectedVotes] = useState<Record<string, Vote>>({});

  const toggleVote = (title: string, vote: Exclude<Vote, null>) => {
    setSelectedVotes((currentVotes) => ({
      ...currentVotes,
      [title]: currentVotes[title] === vote ? null : vote,
    }));
  };

  return (
    <main className={styles.page}>
      <section className={styles.postList} aria-label="Forum posts">
        {posts.map((post) => {
          const selectedVote = selectedVotes[post.title] ?? null;

          return (
            <article
              className={styles.post}
              key={post.title}
            >
              <Image
                className={styles.categoryIcon}
                src={post.image}
                alt=""
                width={120}
                height={120}
              />
              <div className={styles.postContent}>
                <button
                  aria-label={`${post.title} by ${post.author}`}
                  className={styles.postSummary}
                  type="button"
                >
                  <span className={styles.postMeta}>
                    <span className={styles.author}>
                      {post.author} - {post.time}
                    </span>
                    <span className={`${styles.category} ${styles[post.category.toLowerCase()]}`}>
                      {post.category}
                    </span>
                  </span>
                  <span className={styles.title}>{post.title}</span>
                  <span className={styles.excerpt}>{post.excerpt}</span>
                </button>
                <div className={styles.votes}>
                  <button
                    aria-label="Upvote"
                    aria-pressed={selectedVote === 'up'}
                    className={styles.voteButton}
                    onClick={() => toggleVote(post.title, 'up')}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className={`${styles.voteArrow} ${selectedVote === 'up' ? styles.filled : ''}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3 3.5 11h5v10h7V11h5L12 3Z" />
                    </svg>
                  </button>
                  <span className={styles.voteCount}>
                    {post.votes + (selectedVote === 'up' ? 1 : selectedVote === 'down' ? -1 : 0)}
                  </span>
                  <button
                    aria-label="Downvote"
                    aria-pressed={selectedVote === 'down'}
                    className={styles.voteButton}
                    onClick={() => toggleVote(post.title, 'down')}
                    type="button"
                  >
                    <svg
                      aria-hidden="true"
                      className={`${styles.voteArrow} ${styles.downArrow} ${selectedVote === 'down' ? styles.filled : ''}`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 3 3.5 11h5v10h7V11h5L12 3Z" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
};

export default ForumsPage;
