import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
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
    },
  });

  if (!post) {
    notFound();
  }

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

        <div className={styles.voteCount} aria-label={`${post.totalVotes} votes`}>
          <span aria-hidden="true">&uarr;</span>
          <span>{post.totalVotes}</span>
          <span aria-hidden="true">&darr;</span>
        </div>

        <p className={styles.content}>{post.content}</p>
      </article>

      <section className={styles.discussion} aria-labelledby="discussion-heading">
        <h2 id="discussion-heading">Discussion</h2>
        <p>Comments aren&apos;t available yet.</p>
      </section>
    </main>
  );
};

export default PostPage;
