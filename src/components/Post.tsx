'use client';
import styles from '@/app/forums/page.module.css';
import Image from 'next/image';
import { Post, User } from '@prisma/client';
import placeHolderImage from '@/../public/uhLogo.png';
import { useState } from 'react';
import { votePost, removeVote } from '@/lib/dbActions';

// TODO: Fix the buggy arrow fill.
// TODO: Instead of double clicking their vote, users should simply click their vote and it will remove the vote.
// TODO: give immediate feedback when user votes (Users should not have to reload to view the votes after voting on a post)

const PostComponent = ({post, user, voteTotal}: {post: Post, user: {id: number, email: string, username: string}, voteTotal: number}) => {
    const [selectedVote, setSelectedVote] = useState(voteTotal);

    const setVote = (post: Post, voteVal: number) => {
        votePost(post,voteVal);
        voteTotal += voteVal;
        setSelectedVote(voteTotal);
    };

    return (
    <article
        className={styles.post}    >
        <Image
        className={styles.categoryIcon}
        src={placeHolderImage}
        alt=""
        width={120}
        height={120}
        />
        <div className={styles.postContent}>
        <button
            aria-label={`${post.title} by `}
            className={styles.postSummary}
            type="button"
        >
            <span className={styles.postMeta}>
            <span className={styles.author}>
                {user.username}
            </span>
            <span className={`${styles.category} ${styles[post.category.toLowerCase()]}`}>
                {post.category}
            </span>
            </span>
            <span className={styles.title}>{post.title}</span>
            <span className={styles.excerpt}>{post.content}</span>
        </button>
        <div className={styles.votes}>
            <button
            aria-label="Upvote"
            className={styles.voteButton}
            onClick={() => setVote(post, 1)}
            onDoubleClick={() => setVote(post, 0)}
            type="button"
            >
            <svg
                aria-hidden="true"
                className={`${styles.voteArrow} ${selectedVote === 1 ? styles.filled : ''}`}
                viewBox="0 0 24 24"
            >
                <path d="M12 3 3.5 11h5v10h7V11h5L12 3Z" />
            </svg>
            </button>
            <span className={styles.voteCount}>
                {voteTotal}
            </span>
            <button
            aria-label="Downvote"
            className={styles.voteButton}
            onClick={() => setVote(post, -1)}
            onDoubleClick={() => setVote(post, 0)}
            type="button"
            >
            <svg
                aria-hidden="true"
                className={`${styles.voteArrow} ${styles.downArrow} ${selectedVote === -1 ? styles.filled : ''}`}
                viewBox="0 0 24 24"
            >
                <path d="M12 3 3.5 11h5v10h7V11h5L12 3Z" />
            </svg>
            </button>
        </div>
        </div>
    </article>
    );
}

export default PostComponent;   