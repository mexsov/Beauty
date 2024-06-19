import {styled} from 'styled-components';
import { Procedures } from '../components/Procedures';

const HomePageContainer = styled.div`
  padding: 5rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;

`;

const Title = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: 'Poppins', sans-serif;
  line-height: 2rem;
`;

const Text = styled.p`
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  line-height: 1.5rem;
`;

function Homepage() {
  return (
    <HomePageContainer>
      <Title>Welcome to Beauty!</Title>
      <Text>
      Most people think that a beauty salon is a place to go to have your hair, nails or any other body part, well, beautified.
The reality is that most beauty salons do just that but there are many other services such as styling, facials, spa, skin care, hair care, nail services and facial treatments that you can take advantage of offered by professional beauty professionals at different beauty salons whose job is to improve how you look and feel about yourself.
Below are the more popular services and beauty treatments that you can find at a beauty salon.
      </Text>
      <Procedures />
    </HomePageContainer>
  );
}

export default Homepage;
