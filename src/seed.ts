import { prisma } from './lib/prisma';
import { Role, Category } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database');
  const password = await hash('changeme', 10);
  for (const account of config.defaultAccounts) {
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        username: account.username,
        password,
        role,
      },
    });
    // console.log(`  Created user: ${user.email} with role: ${user.role}`);
  }
  for (const data of config.defaultPosts) {
    const category = data.category as Category;
    console.log(`  Adding posts: ${JSON.stringify(data)} with categories: ${category}`);
    
    await prisma.post.upsert({
      where: { id: config.defaultPosts.indexOf(data) + 1 },
      update: {},
      create: {
        title: data.title,
        content: data.content,
        totalVotes: data.totalVotes,
        author: {
          connect: { email: data.author },
        },
        category,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
