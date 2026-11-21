import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import { getPostValue } from '@/lib/dbActions'
import PostComponent from '@/components/Post';

const ForumsPage = async () => {
  const posts = await prisma.post.findMany ({
    include: {
      author: {
        select: {id: true, email: true, username: true },
      },
    },
  });

  const voteTotals = await Promise.all(posts.map((post) => getPostValue(post)));

  return(
    <main className={styles.page}>
      <section className={styles.postList} aria-label="Forum posts">
        {posts.map((post, index) => (
          <PostComponent post={post} user={post.author} voteTotal={voteTotals[index]} key={post.id}/>
        ))}
      </section>
    </main>
  );
};

export default ForumsPage;
