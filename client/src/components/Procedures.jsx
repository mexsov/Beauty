import { useContext, useEffect, useState } from 'react';
import { ProcedureCard } from './ProcedureCard';
import styled from 'styled-components';
import axios from 'axios';
import { AuthContext } from '../utils/AuthContext';
import SyncLoader from "react-spinners/SyncLoader";
import { DeleteModal } from "./DeleteModal";
import Search from "./Search";
import CreateButton from "./CreateButton";
import { useNavigate } from "react-router-dom";

const ProceduresPageContainer = styled.div`
  padding: 4rem 0rem;
  max-width: 75rem;
  margin: 0 auto;
`;

const ProceduresContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 1.25rem;
  margin-top: 1.25rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  max-width: 77.5rem;
  margin: 0 auto;
`;

const Info = styled.p`
  font-size: 1.25rem;
  word-break: break-word;
  user-select: none;
  padding: 2rem 2rem 2rem 0;
`;

export const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [filteredProcedures, setFilteredProcedures] = useState([]);
  const [proceduresLoading, setProcedureLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [deleteModalItemId, setDeleteModalItemId] = useState(null);
  const [procedureSchedule, setProcedureSchedule] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProcedures = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/beauty/Procedures');
        setProcedures(response.data);
        setFilteredProcedures(response.data);
        await fetchAllProcedureSchedules(response.data);
      } catch (error) {
        console.error('Error fetching procedures:', error);
        setError('Failed to load procedures.');
      } finally {
        setProcedureLoading(false);
      }
    };

    fetchProcedures();
  }, []);

  useEffect(() => {
    filterProcedures();
  }, [searchQuery, procedures, procedureSchedule]);

  const fetchAllProcedureSchedules = async (procedures) => {
    const scheduleMap = {};
    try {
      const schedules = await Promise.all(procedures.map(procedure => fetchProcedureSchedule(procedure.id)));
      procedures.forEach((procedure, index) => {
        scheduleMap[procedure.id] = schedules[index];
      });
      setProcedureSchedule(scheduleMap);
    } catch (error) {
      console.error('Error fetching procedure schedules:', error);
      setError('Failed to load procedure schedules.');
    }
  };

  const fetchProcedureSchedule = async (procedureId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/beauty/Procedures/${procedureId}/schedule`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching schedule for procedure ${procedureId}:`, error);
      return [];
    }
  };

  const deleteProcedure = async (procedureId) => {
    try {
      await axios.delete(`http://localhost:3001/api/beauty/Procedures/${procedureId}`);
      const updatedProcedures = procedures.filter(procedure => procedure.id !== procedureId);
      setProcedures(updatedProcedures);
      setFilteredProcedures(updatedProcedures);
    } catch (error) {
      console.error('Error deleting procedure:', error);
      setError('Failed to delete procedure.');
    }
  };

  const filterProcedures = () => {
    if (searchQuery.trim() === "") {
      setFilteredProcedures(procedures);
    } else {
      const filtered = procedures.filter(procedure => {
        return (
          (procedure.title && procedure.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (procedure.date_time && procedure.date_time.includes(searchQuery)) ||
          (procedureSchedule[procedure.id] && procedureSchedule[procedure.id].some(scheduleItem => {
            return scheduleItem && scheduleItem.toString().toLowerCase().includes(searchQuery.toLowerCase());
          }))
        );
      });
      setFilteredProcedures(filtered);
    }
  };

  return (
    <>
      <ProceduresPageContainer>
        <ButtonsContainer>
          {user && user.role === "admin" && (
            <CreateButton
              buttonTitle="Add procedure"
              onClick={() => navigate("/create")}
            />
          )}
          <Search onSearch={setSearchQuery} />
        </ButtonsContainer>
        <ProceduresContainer>
          {proceduresLoading ? (
            <LoadingContainer>
              <SyncLoader color={"#dddddd"} loading={proceduresLoading} size={20} />
            </LoadingContainer>
          ) : (
            filteredProcedures.length === 0 ? (
              <Info>No procedures available</Info>
            ) : (
              filteredProcedures.map((procedure) => (
                <ProcedureCard
                  key={procedure.id}
                  {...procedure}
                  isVisible={user && user.role === "admin"}
                  onDeleteModalOpen={() => setDeleteModalItemId(procedure.id)}
                  hasReview={procedure.hasReview}
                  schedule={procedureSchedule[procedure.id] || []}
                />
              ))
            )
          )}
        </ProceduresContainer>
        {deleteModalItemId && (
          <DeleteModal
            procedureId={deleteModalItemId}
            onClose={() => setDeleteModalItemId(null)}
            onDelete={() => {
              deleteProcedure(deleteModalItemId);
              setDeleteModalItemId(null);
            }}
          />
        )}
        {error && <Info>{error}</Info>}
      </ProceduresPageContainer>
    </>
  );
};
