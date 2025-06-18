import Container from 'react-bootstrap/Container';

const Main = ({ children }) => {
  return (
    <div className="main-wrapper">
      <Container className="main-container py-4">
        {children}
      </Container>
    </div>
  );
};

export default Main;