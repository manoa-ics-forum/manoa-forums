import styles from './page.module.css';
import Link from 'next/link';

/** The Home page. */
const Home = () => (
  <main className={styles.landing}>
    <section className={styles.hero} aria-labelledby="landing-heading">
      <h1 id="landing-heading">
        A place to connect and discuss academics, campus life, and experiences in Hawaii
      </h1>
      <div className={styles.actions}>
        <button className={styles.button} type="button">
          View Forums
        </button>
        <Link className={styles.button} href="/auth/signin">
          Sign In
        </Link>
      </div>
    </section>
  </main>
);

export default Home;
