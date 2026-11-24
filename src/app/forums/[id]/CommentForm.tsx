'use client';

import { useActionState } from 'react';
import { createComment, type CommentActionState } from '@/lib/dbActions';
import styles from './page.module.css';

const initialState: CommentActionState = {};

const CommentForm = ({ postId }: { postId: number }) => {
  const [state, formAction, isPending] = useActionState(
    createComment.bind(null, postId),
    initialState,
  );

  return (
    <form className={styles.commentForm} action={formAction}>
      <label className={styles.commentLabel} htmlFor="comment-content">
        Add a comment
      </label>
      <textarea
        className={styles.commentInput}
        id="comment-content"
        name="content"
        maxLength={2000}
        required
        rows={4}
      />
      {state.error && <p className={styles.formError} role="alert">{state.error}</p>}
      {state.success && <p className={styles.formSuccess} role="status">{state.success}</p>}
      <button className={styles.submitComment} type="submit" disabled={isPending}>
        {isPending ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
};

export default CommentForm;
