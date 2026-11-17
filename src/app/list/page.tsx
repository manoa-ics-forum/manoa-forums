import { Col, Container, Row, Table } from 'react-bootstrap';
import { Stuff } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { loggedInProtectedPage } from '@/lib/page-protection';
import { auth } from '@/lib/auth';

const StuffItem = ({ name, quantity, condition, id }: Stuff) => (
  <tr>
    <td>{name}</td>
    <td>{quantity}</td>
    <td>{condition}</td>
    <td>
      <a href={`/edit/${id}`}>Edit</a>
    </td>
  </tr>
);

/** Render a list of stuff for the logged in user. */
const ListPage = async () => {
  // Protect the page, only logged in users can access it.
  const session = await auth();
  loggedInProtectedPage(
    session as {
      user: { email: string; id: string; name: string };
    } | null,
  );
  const owner = (session && session.user && session.user.email) || '';
  const stuff = await prisma.stuff.findMany({
    where: {
      owner,
    },
  });
  // console.log(stuff);
  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Row>
          <Col>
            <h1>Stuff</h1>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stuff.map((item) => (
                  <StuffItem key={item.id} {...item} />
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ListPage;
