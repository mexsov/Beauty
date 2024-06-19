import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from 'styled-components';
import { AuthContext } from '../utils/AuthContext';

const PageContainer = styled.div`
  padding: 7rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const ProcedureDetailsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 75rem;
  padding: 20px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;

  h2 {
    font-size: 0.85rem;
    color: #818181;
    margin-bottom: 0.5rem;
    font-weight: normal;
  }

  p {
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
`;

const Details = styled.div`
  flex: 1;
`;

const ImageContainer = styled.div`
  width: 40%;
  margin-right: 20px;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
`;

const IconContainer = styled.p`
  display: flex;
  gap: 0.5rem;
`;
const StyledIcon = styled.img`
  width: 2rem;
  &:hover {
    filter: brightness(0.5);
    transform: scale(0.9);
  }
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #000;
  border: 1px solid #dddddd;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;
  &:hover {
    background-color: #dddddd;
    transform: scale(1.05);
  }
`;

const ProcedureDetails = () => {
  const { id } = useParams();
  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  

  const [procedureSchedule, setProcedureSchedule] = useState([]);

  useEffect(() => {
    const fetchProcedureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/beauty/procedures/${id}`);
        setProcedure(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch procedure details:', error);
      }
    };

    fetchProcedureDetails();
  }, [id]);

  useEffect(() => {
    // kreipimasis i serveri, kad gauti info apie datas ir laikus
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/beauty/schedule/${id}`);
        setProcedureSchedule(response.data); // iset'inam gautus duomenis i usestate
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule(); // funkcijos iskvietimas laiku gavimui
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!procedure) {
    return <p>Procedure not found</p>;
  }

  return (
    <PageContainer>
      <ProcedureDetailsContainer>
        {procedure && (
          <>
            <Details>
              <DetailItem>
                <h2>Title:</h2>
                <p>{procedure.title}</p>
              </DetailItem>
              <DetailItem>
                <h2>Type:</h2>
                <p>{procedure.type}</p>
              </DetailItem>
              <DetailItem>
                <h2>Duration:</h2>
                <p>{procedure.duration} min</p>
              </DetailItem>
              <DetailItem>
                <h2>Price:</h2>
                <p>{procedure.price} €</p>
              </DetailItem>
              <DetailItem>
                <h2>Rating:</h2>
                <p>{procedure.average_rating}</p>
              </DetailItem>
              {isAuthenticated && !isAdmin && (
                <DetailItem>
                  <>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/procedures/${id}/addreview`);
                      }}
                    >
                      Add Review
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/procedures/${id}/register`);
                      }}
                    >
                      Register
                    </Button>
                  </>
                </DetailItem>
              )}

            </Details>
            {procedure.image && (
              <ImageContainer>
                <Image src={procedure.image} alt={procedure.title} />
              </ImageContainer>
            )}
          </>
        )}
      </ProcedureDetailsContainer>
    </PageContainer>
  );
};

export default ProcedureDetails;
