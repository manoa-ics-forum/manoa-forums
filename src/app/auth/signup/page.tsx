'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import { createUser } from '@/lib/dbActions';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const validationSchema = Yup.object({
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),

  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(40, 'Password must not exceed 40 characters'),

  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf(
      [Yup.ref('password')],
      'Passwords do not match',
    ),
});

/** Manoa Forums account registration page. */
const SignUp = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    setError('');
    setLoading(true);

    try {
      const email = data.email.trim().toLowerCase();

      // Create a new account
      const result = await createUser({
        email,
        password: data.password,
      });

      if (!result.success) {
        setError(
          result.error || 'Unable to create your account.',
        );
        return;
      }

      // Automatically sign in after registration
      const signInResult = await signIn('credentials', {
        email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.ok && !signInResult.error) {
        window.location.assign('/');
      } else {
        setError(
          'Your account was created, but automatic sign-in failed. Please sign in manually.',
        );
        reset();
      }
    } catch {
      setError(
        'An unexpected error occurred. Please try again.',
      );
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
                  Create an Account
                </h2>

                <p className="text-muted mb-4 text-center">
                  Join the Manoa Forums community to
                  participate in discussions, share ideas,
                  and connect with other students and faculty.
                </p>

                {error && (
                  <Alert variant="danger" role="alert">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group
                    className="mb-3"
                    controlId="signup-email"
                  >
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      autoComplete="email"
                      isInvalid={!!errors.email}
                      {...register('email')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="signup-password"
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      isInvalid={!!errors.password}
                      {...register('password')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password?.message}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Password must be between 6 and 40 characters.
                    </Form.Text>
                  </Form.Group>

                  <Form.Group
                    className="mb-4"
                    controlId="signup-confirm-password"
                  >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      isInvalid={!!errors.confirmPassword}
                      {...register('confirmPassword')}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmPassword?.message}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="success"
                    className="w-100 py-2"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>
              </Card.Body>

              <Card.Footer className="text-center py-3">
                <p className="mb-2">
                  Already have an account?{' '}
                  <Link href="/auth/signin">
                    Sign In
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

export default SignUp;
