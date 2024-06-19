import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import {styled} from 'styled-components';
import { format } from 'date-fns';

const PageContainer = styled.div`
  padding: 7rem 3rem 2rem 3rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const ProceduresContainer = styled.div`
display: flex;
flex-wrap: wrap;
gap: 1rem;
`;

const Title = styled.p`
  font-weight: 500;
  font-size: 1.25rem;
  word-break: break-word;
  user-select: none;
  padding-bottom: 2rem;
  color: #666666;
`;

const ProcedureItem = styled.div`
border: 1px solid #dddddd;
border-radius: 0.25rem;
padding: 1rem;
  width: calc(33.33% - 1rem);
`;

const ProcedureName = styled.div`
  font-weight: 500;
  font-size: 1rem;
  word-break: break-word;
  user-select: none;
  line-height: 1.5;
`;

const ProcedureDate = styled.div`
  font-weight: 500;
  font-size: 1rem;
  word-break: break-word;
  user-select: none;
  line-height: 1.5;
`;
const Status = styled.div`
  color: ${props => props.isConfirmed ? 'green' : 'red'};
  line-height: 1.5;
`;

const Button = styled.button`
  background-color: #ffffff;
  color: #000;
  border: 1px solid #dddddd;
  padding: 0.5rem 1rem;
  margin: 1rem 1rem 1rem 0;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  transition:
    background-color 0.3s,
    color 0.3s,
    transform 0.3s;

  &:hover {
    background-color: #dddddd;
    transform: scale(1.05);
  }
`;

const MyproceduresPage = () => {
  const { user } = useContext(AuthContext);
  const [procedures, setprocedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchprocedures = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`http://localhost:3001/api/beauty/users/my-procedures/${user.id}`);
          setprocedures(response.data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('User not found');
      }
    };

    if (user) {
      fetchprocedures();
    }
  }, [user]);
  console.log(procedures);

  const cancelRegistration = async (registrationId) => {
    try {
      await axios.delete(`http://localhost:3001/api/beauty/users/${registrationId}`);
      // atšaukus registraciją, atnaujiname ekskursijų sąrašą
      const response = await axios.get(`http://localhost:3001/api/beauty/users/my-procedures/${user.id}`);
      setprocedures(response.data);
    } catch (error) {
      console.error('Unable to cancel registration:', error.message);
      alert('Unable to cancel registration. Please try again later.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <PageContainer>
      <Title>My procedures</Title>
      <ProceduresContainer>
        {procedures.length === 0 ? (
          <p>No registered procedures found.</p>
        ) : (
          procedures.map((procedure) => {
            const formatted_date_time = format(new Date(procedure.date_time), 'yyyy.MM.dd HH:mm') + ' val.';
            return (
              <ProcedureItem key={procedure.registration_id}>
                <ProcedureName>{procedure.procedure_title}</ProcedureName>
                <ProcedureDate>{formatted_date_time}</ProcedureDate>
                <Status isConfirmed={procedure.confirmation}>{procedure.confirmation ? "Confirmed" : "Not confirmed"}</Status>
                <Button onClick={() => cancelRegistration(procedure.registration_id)}>Cancel registration</Button>
                <Button onClick={() => changeRegistrationDate(procedure.registration_id)}>Change date</Button>
              </ProcedureItem>
            );
          })
        )}
      </ProceduresContainer>
    </PageContainer>
  );
};

export default MyproceduresPage;
