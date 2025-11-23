/* eslint-disable prettier/prettier */
import { verifyUser } from "api/login/verifyUser";
import { useEffect, ReactNode } from "react";
// import { Navigate } from 'react-router-dom';
// import { useNavigate, useLocation, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { getData } from "./firebase/auth_get_user_profile_provider";
// import { BlockAccess } from "./BlockAccess";

interface ProtectedRouteProps {
  children: ReactNode;
}

// export default function ProtectedRoute({ children }) {
export default function ProtectedRoute({ children }: ProtectedRouteProps) {

    // const navigate = useNavigate();
    // const location = useLocation();
    // const { pathname } = location;
    // const loginMethod = useSelector((state) => state.login.method);
    // const [verifyResult, setVerifyResult] = useState(null);
    // console.log(loginMethod);

    useEffect(()=>{
        verify();
    },[]);

    const verify = async() => {
        const loginMethod = 'tk'; // 임시로 설정 (실제로는 useSelector에서 가져와야 함)
        const result = await verifyUser(loginMethod);
        // console.log(verify.ok);
        if(!result.ok) {
            // await navigate('/login', { state: result.message }, { replace: true });
            // <Navigate to={'/fdfd'} replace />
            alert('접근 권한이 없습니다.');
            return;
        }
    };
    // console.log(verifyResult);
    // return verifyResult ? <ProtectedComp /> : null
    return <>{children}</>;
}

