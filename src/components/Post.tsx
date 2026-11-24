'use client';
import styles from '@/app/forums/page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { Post, Vote } from '@prisma/client';
import { useState } from 'react';
import { votePost } from '@/lib/dbActions';

const categoryIcons: Record<Post['category'], string> = {
    campus: '/campusTag.png',
    classes: '/classTag.png',
    events: '/eventTag.png',
    financial: '/financialTag.png',
    important: '/importantTag.png',
    other: '/otherTag.png',
    resources: '/resourcesTag.png',
    sports: '/sportsTag.png',
};

const PostComponent = ({post, user, userVotedPost}: {post: Post, user: {id: number, username: string}, userVotedPost: {votes: Vote[], email: string}}) => {
    const [voteTotal, setPostValue] = useState(post.totalVotes);
    const [userVote, setuserVote] = useState<-1 | 0 | 1>(
        (userVotedPost?.votes.find(votedPost => votedPost.postId === post.id)?.value ?? 0) as -1 | 0 | 1
    );

    const setVote = (voteVal: -1 | 1) => {
        const nextVote = userVote === voteVal ? 0 : voteVal;
        const changeInVote = nextVote - userVote;

        setuserVote(nextVote);
        setPostValue(current => current + changeInVote);
        void votePost(post.id, voteVal).catch(() => {
            setPostValue(post.totalVotes);
            setuserVote(
                (userVotedPost?.votes.find(votedPost => votedPost.postId === post.id)?.value ?? 0) as -1 | 0 | 1
            );
        });
    };

    return (
    <article
        className={styles.post}>
        <Image
        className={styles.categoryIcon}
        src={categoryIcons[post.category]}
        alt=""
        width={120}
        height={120}
        />
        <div className={styles.postContent}>
        <Link
            aria-label={`Read post: ${post.title}`}
            className={styles.postSummary}
            href={`/forums/${post.id}`}
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
        </Link>
        <div className={styles.votes}>
            <button
            aria-label="Upvote"
            className={styles.voteButton}
            onClick={() => setVote(1)}
            type="button"
            >
            <svg
                aria-hidden="true"
                className={`${styles.voteArrow} ${(userVote === 1) ? styles.filled : ''}`}
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
            onClick={() => setVote(-1)}
            type="button"
            >
            <svg
                aria-hidden="true"
                className={`${styles.voteArrow} ${styles.downArrow} ${(userVote === -1) ? styles.filled : ''}`}
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