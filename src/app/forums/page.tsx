import { Col, Container, Row } from 'react-bootstrap';

/** Render the open forums page. */
const openForums = () => (
  <main>
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={4} className="text-center">
          <h2>
            <p>Open Forums</p>
          </h2>
        </Col>
      </Row>
    </Container>
  </main>
);

export default openForums;
