import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer
    className="mt-auto py-3 text-white"
    style={{
      backgroundColor: '#1D563C',
      fontWeight: 850,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    }}
  >
    <Container>
      <Col className="text-center">
        Manoa Forums
        <br />
        University of Hawaii
        <br />
        Honolulu, HI 96822
        <br />
      </Col>
    </Container>
  </footer>
);

export default Footer;
