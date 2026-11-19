'use client';

import { useSession } from 'next-auth/react'; // v5 compatible
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, Lock } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session, status } = useSession();
  const pathName = usePathname();
  if (status === 'loading') return null;
  const currentUser = session?.user?.email;
  const role = session?.user?.role;
  return (
    <Navbar
      variant="dark"
      expand="lg"
      style={{ backgroundColor: '#01723E', minHeight: '78px', padding: '0.5rem 0' }}
    >
      <Container fluid style={{ padding: '0 8%' }}>
        <Navbar.Brand href="/forums">
          <Image
            src="/forumsLogo.png"
            alt="University of Hawaii at Manoa Forums"
            width={140}
            height={50}
            unoptimized
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto justify-content-start">
            {currentUser && (
              <>
                <Nav.Link id="add-stuff-nav" href="/add" active={pathName === '/add'}>
                  Add Stuff
                </Nav.Link>
                <Nav.Link id="list-stuff-nav" href="/list" active={pathName === '/list'}>
                  List Stuff
                </Nav.Link>
              </>
            )}
            {currentUser && role === 'ADMIN' && (
              <Nav.Link id="admin-stuff-nav" href="/admin" active={pathName === '/admin'}>
                Admin
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {session ? (
              <NavDropdown id="login-dropdown" title={currentUser}>
                <NavDropdown.Item id="login-dropdown-sign-out" href="/api/auth/signout">
                  <BoxArrowRight />
                  Sign Out
                </NavDropdown.Item>
                <NavDropdown.Item id="login-dropdown-change-password" href="/auth/change-password">
                  <Lock />
                  Change Password
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div
                style={{
                  backgroundColor: '#01723E',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.5rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <Nav.Link
                  href="/forums"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#01723E',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.7rem 2rem',
                    lineHeight: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '180px',
                    boxShadow: 'none',
                  }}
                >
                  View Forums
                </Nav.Link>
                <Nav.Link
                  href="/auth/signin"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#01723E',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '0.7rem 2.5rem',
                    lineHeight: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '180px',
                    boxShadow: 'none',
                  }}
                >
                  Sign In
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
