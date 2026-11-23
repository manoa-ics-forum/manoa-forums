/*  
 *  Updated forum page 11/22/26
 *  11/22/26: For some reason, session.user.id is undefined. session.user.email is used instead. 
 *    TODO: Maybe use userId instead of email?
 */

import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import PostComponent from '@/components/Post';
import { auth } from '@/lib/auth';

const ForumsPage = async () => {
  const posts = await prisma.post.findMany ({
    include: {
      author: {
        select: {id: true, username: true},
      },
    },
  });

  const session = await auth();
  const userEmail = session?.user.email || "";
  const votedPosts = await prisma.user.findUnique({
    where: {email: userEmail},
    select: { votes: true }
  }) || null;

  return(
    <main className={styles.page}>
      <section className={styles.postList} aria-label="Forum posts">
        {posts.map((post) => (
          <PostComponent post={post} user={post.author} userVotedPost={{votes: votedPosts?.votes ?? [], email: userEmail}} key={post.id}/>
        ))}
      </section>
    </main>
  );
};

export default ForumsPage;
