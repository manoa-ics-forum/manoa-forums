import styles from './page.module.css';

const tags = ['CAMPUS', 'CLASSES', 'EVENTS', 'FINANCIAL', 'IMPORTANT', 'OTHER', 'RESOURCES', 'SPORTS'];

const CreatePostPage = () => (
  <main className={styles.page}>
    <section className={styles.editor} aria-label="Create a forum post">
      <div className={styles.titleRow}>
        <label className={styles.titleField}>
          <span className={styles.visuallyHidden}>Title</span>
          <input aria-required="true" placeholder="TITLE" type="text" />
          <span className={styles.required} aria-hidden="true">*</span>
        </label>
        <label className={styles.tagPicker}>
          <span className={styles.visuallyHidden}>Choose a tag</span>
          <select defaultValue="">
            <option value="" disabled>
              ADD TAG
            </option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className={styles.visuallyHidden} htmlFor="post-body">
        Post body
      </label>
      <textarea className={styles.bodyField} id="post-body" placeholder="..." />
      <div className={styles.actions}>
        <button className={styles.postButton} type="button">
          POST
        </button>
      </div>
    </section>
  </main>
);

export default CreatePostPage;
