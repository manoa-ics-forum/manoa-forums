'use server';

import { Post, Stuff, Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';
import { auth } from '@/lib/auth';

export async function votePost(post: Post, val: number) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('You must be signed in to vote.');
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Signed-in user was not found.');

  await prisma.vote.upsert({
    where: {
      userId_postId: {
        userId: user.id,
        postId: post.id,
      },
    },
    update: {
      value: val
    },
    create: {
      value: val,
      userId: user.id,
      postId: post.id,
    },
  });
}

export async function removeVote(post: Post) {
  const session = await auth();
  const email = session?.user.email;
  if (!email) throw new Error('You must be signed in to vote.');
  const user = await prisma.user.findUnique({where: { email }});
  if (!user) throw new Error('Signed-in user was not found.');
  await prisma.vote.delete({
    where: {
      userId_postId: {
        userId: user.id,
        postId: post.id,
      },
    },
  });
}

export async function getPostValue(post: Post) {
  const votes = await prisma.vote.findMany({
    where: {
      postId: post.id
    },
    select : {
      value: true,
    }
  })

  return votes.reduce((total, current) => total + current.value, 0);

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
