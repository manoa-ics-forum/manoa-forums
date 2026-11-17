import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

const AddStuff = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  return (
    <main>
      <h1>Add Stuff</h1>
      <p>This feature is not part of the landing-page build.</p>
    </main>
  );
};

export default AddStuff;
