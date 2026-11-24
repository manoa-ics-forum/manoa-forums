'use client';

import { useState } from 'react';
import { votePost } from '@/lib/dbActions';
import styles from './page.module.css';

type VoteControlsProps = {
  postId: number;
  initialVote: -1 | 0 | 1;
  initialVoteCount: number;
  signedIn: boolean;
};

const VoteControls = ({
  postId,
  initialVote,
  initialVoteCount,
  signedIn,
}: VoteControlsProps) => {
  const [vote, setVote] = useState<-1 | 0 | 1>(initialVote);
  const [count, setCount] = useState(initialVoteCount);
  const [error, setError] = useState('');

  const handleVote = async (value: -1 | 1) => {
    if (!signedIn) return;

    const nextVote = vote === value ? 0 : value;
    const previousVote = vote;
    const previousCount = count;

    setVote(nextVote);
    setCount(previousCount + nextVote - previousVote);
    setError('');

    try {
      await votePost(postId, value);
    } catch (actionError) {
      setVote(previousVote);
      setCount(previousCount);
      setError(actionError instanceof Error ? actionError.message : 'Unable to vote.');
    }
  };

  return (
    <>
      <div className={styles.voteControls} aria-label={`${count} votes`}>
        <button
          type="button"
          className={styles.voteButton}
          aria-label="Upvote"
          aria-pressed={vote === 1}
          disabled={!signedIn}
          onClick={() => void handleVote(1)}
        >
          <svg
            aria-hidden="true"
            className={`${styles.voteArrow} ${vote === 1 ? styles.filled : ''}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 3 3.5 11h5v10h7V11h5L12 3Z" />
          </svg>
        </button>
        <span className={styles.voteCount}>{count}</span>
        <button
          type="button"
          className={styles.voteButton}
          aria-label="Downvote"
          aria-pressed={vote === -1}
          disabled={!signedIn}
          onClick={() => void handleVote(-1)}
        >
          <svg
            aria-hidden="true"
            className={`${styles.voteArrow} ${styles.downArrow} ${vote === -1 ? styles.filled : ''}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 3 3.5 11h5v10h7V11h5L12 3Z" />
          </svg>
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
    </>
  );
};

export default VoteControls;
