'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';

/** Manoa Forums sign-in page. */
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else if (result?.ok) {
        window.location.assign('/');
      } else {
        setError('Unable to sign in. Please try again.');
      }
    } catch {
      setError('An error occurred while signing in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-5">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={5}>
            <Card className="shadow-sm border-0">
              <Card.Header
                className="text-white text-center py-4"
                style={{ backgroundColor: '#075338' }}
              >
                <h1 className="h2 mb-2">
                  Manoa Forums
                </h1>
                <p className="mb-0">
                  Connect with the UH Mānoa community
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                <h2 className="h4 mb-3 text-center">
                  Welcome Back!
                </h2>

                <p className="text-muted mb-4 text-center">
                  Sign in to participate in discussions,
                  share ideas, and connect with the
                  campus community.
                </p>

                {error && (
                  <Alert variant="danger" role="alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSignIn}>
                  <Form.Group
                    className="mb-3"
                    controlId="signin-email"
                  >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                      }}
                      required
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="signin-password"
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                      }}
                      required
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </Form>

                <hr className="my-4" />

                <Button
                  type="button"
                  variant="outline-success"
                  className="w-100 py-2"
                  disabled
                >
                  Sign In with UH Account
                </Button>

                <p className="text-muted small text-center mt-3">
                  UH authentication integration coming soon.
                </p>
              </Card.Body>

              <Card.Footer className="text-center py-3">
                <p className="mb-2">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup">
                    Create an Account
                  </Link>
                </p>

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
};

export default SignIn;
