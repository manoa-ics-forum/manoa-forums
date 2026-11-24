import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import CommentForm from './CommentForm';
import VoteControls from './VoteControls';
import styles from './page.module.css';

type PostPageProps = {
  params: Promise<{ id: string }>;
};

const PostPage = async ({ params }: PostPageProps) => {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isInteger(postId) || postId < 1) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: { username: true },
      },
      comments: {
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: {
          author: {
            select: { username: true },
          },
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  const session = await auth();
  const userVote = session?.user?.email
    ? await prisma.vote.findFirst({
        where: {
          postId,
          user: { email: session.user.email },
        },
        select: { value: true },
      })
    : null;

  return (
    <main className={styles.page}>
      <article className={styles.post}>
        <Link className={styles.backLink} href="/forums">
          &larr; Back to forums
        </Link>

        <div className={styles.postMeta}>
          <span className={styles.author}>{post.author.username}</span>
          <span className={`${styles.category} ${styles[post.category]}`}>
            {post.category}
          </span>
        </div>

        <h1 className={styles.title}>{post.title}</h1>

        <VoteControls
          postId={postId}
          initialVote={(userVote?.value === 1 || userVote?.value === -1) ? userVote.value : 0}
          initialVoteCount={post.totalVotes}
          signedIn={Boolean(session?.user?.email)}
        />

        <p className={styles.content}>{post.content}</p>
      </article>

      <section className={styles.discussion} aria-labelledby="discussion-heading">
        <h2 id="discussion-heading">Discussion</h2>
        {post.comments.length === 0 ? (
          <p className={styles.emptyDiscussion}>No comments yet. Start the discussion.</p>
        ) : (
          <ol className={styles.commentList}>
            {post.comments.map((comment) => (
              <li className={styles.comment} key={comment.id}>
                <div className={styles.commentMeta}>
                  <span className={styles.commentAuthor}>{comment.author.username}</span>
                  <time dateTime={comment.createdAt.toISOString()}>
                    {comment.createdAt.toLocaleString()}
                  </time>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
              </li>
            ))}
          </ol>
        )}

        {session?.user?.email ? (
          <CommentForm postId={postId} />
        ) : (
          <p className={styles.signInPrompt}>
            <Link href="/auth/signin">Sign in</Link> to leave a comment.
          </p>
        )}
      </section>
    </main>
  );
};

export default PostPage;
