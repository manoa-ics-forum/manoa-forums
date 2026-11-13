import Link from 'next/link';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';

/** Manoa Forums sign-in page. */
const SignIn = () => (
  <main className="py-5">
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-sm border-0">
            <Card.Header
              className="text-white text-center py-4"
              style={{ backgroundColor: '#075338' }}
            >
              <h1 className="h2 mb-2">Manoa Forums</h1>
              <p className="mb-0">
                Connect with the UH Mānoa community
              </p>
            </Card.Header>

            <Card.Body className="p-4 text-center">
              <h2 className="h4 mb-3">Welcome Back!</h2>

              <p className="text-muted mb-4">
                Sign in to participate in discussions,
                share ideas, and connect with the
                campus community.
              </p>

              <Button
                variant="success"
                className="w-100 py-2"
                disabled
              >
                Sign In with UH Account
              </Button>

              <p className="text-muted small mt-3">
                UH authentication integration coming soon.
              </p>
            </Card.Body>

            <Card.Footer className="text-center py-3">
              <span>Want to explore first? </span>
              <Link href="/">
                Browse Forums
              </Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  </main>
);

export default SignIn;
