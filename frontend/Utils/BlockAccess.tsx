/* eslint-disable prettier/prettier */
import { Navigate } from 'react-router-dom';

export const BlockAccess = () => {
    return <Navigate to="/login" replace={true} />;
};

