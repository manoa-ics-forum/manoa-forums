'use server';
import { Stuff, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';
import { auth } from '@/lib/auth';

export type CommentActionState = {
  error?: string;
  success?: string;
};

export async function createComment(
  postId: number,
  _previousState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { error: 'You must be signed in to comment.' };
  }

  if (!Number.isInteger(postId) || postId < 1) {
    return { error: 'This post could not be found.' };
  }

  const content = formData.get('content');
  if (typeof content !== 'string') {
    return { error: 'Enter a comment before submitting.' };
  }

  const trimmedContent = content.trim();
  if (!trimmedContent) {
    return { error: 'Enter a comment before submitting.' };
  }
  if (trimmedContent.length > 2000) {
    return { error: 'Comments must be 2000 characters or fewer.' };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: 'Your signed-in account could not be found.' };
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) {
    return { error: 'This post could not be found.' };
  }

  await prisma.comment.create({
    data: {
      content: trimmedContent,
      postId,
      authorId: user.id,
    },
  });

  revalidatePath(`/forums/${postId}`);
  return { success: 'Your comment was added.' };
}

export async function votePost(postId: number, val: -1 | 1) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('You must be signed in to vote.');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Signed-in user was not found.');

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true },
  });
  if (!post) throw new Error('This post could not be found.');

  const vote = await prisma.vote.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  let change = 0;

  if (!vote) {
    await prisma.vote.create({
      data: { postId, userId: user.id, value: val },
    });
    change = val;
  } else if (vote.value === val) {
    await prisma.vote.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });
    change = -val;
  } else {
    await prisma.vote.update({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
      data: { value: val },
    });
    change = val - vote.value;
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      totalVotes: { increment: change },
    },
  });

  revalidatePath('/forums');
  revalidatePath(`/forums/${postId}`);
}

/**
 * Edits an existing stuff in the database.
 */
export async function editStuff(stuff: Stuff) {
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });

  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 */
export async function deleteStuff(id: number) {
  await prisma.stuff.delete({
    where: { id },
  });

  redirect('/list');
}

/**
 * Creates a new user in the database.
 * Validates credentials, hashes the password,
 * and handles duplicate email addresses.
 */
export async function createUser(
  credentials: { email: string; password: string },
): Promise<{ success: boolean; error?: string }> {
  const email = credentials.email?.trim().toLowerCase();
  const password = credentials.password;

  // Validate email
  if (
    typeof email !== 'string'
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return {
      success: false,
      error: 'Please enter a valid email address.',
    };
  }

  // Validate password
  if (
    typeof password !== 'string'
    || password.length < 6
    || password.length > 40
  ) {
    return {
      success: false,
      error: 'Password must be between 6 and 40 characters.',
    };
  }

  try {
    // Check whether the email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    // Hash the password before storing it
    const hashedPassword = await hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error) {
    // Handle duplicate email conflicts
    if (
      error instanceof Prisma.PrismaClientKnownRequestError
      && error.code === 'P2002'
    ) {
      return {
        success: false,
        error: 'An account with this email already exists.',
      };
    }

    console.error('Account registration failed:', error);

    return {
      success: false,
      error: 'Unable to create your account. Please try again.',
    };
  }
}

/**
 * Changes the password of an existing user in the database.
 */
export async function changePassword(credentials: {
  email: string;
  password: string;
}) {
  const password = await hash(credentials.password, 10);

  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
