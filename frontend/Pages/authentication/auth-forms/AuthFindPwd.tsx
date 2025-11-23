import { useState, useEffect } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import FindPwdBefore from './FindPwd_Be';
import FindPwdAfter from './FindPwd_Af';
import { useParams } from 'react-router';
import { verifyParams } from 'utils/niceApiAuth';
import { useEn_Decryption } from 'utils/crypt';

const AuthFindPwd = () => {
  const { id, key } = useParams<{ id?: string; key?: string }>();
  const [pass, setPass] = useState(false);
  const { decrypt } = useEn_Decryption();

  /** 인증키 일치 여부 확인 */
  useEffect(() => {
    const verifyKey = async () => {
      if (id && key) {
        await verifyParams(id, key, setPass, decrypt);
      }
    };

    verifyKey();
  }, [id, key, decrypt]);

  /** 인증 완료 시 패스워드 변경 컴포넌트, 인증 전/실패 시 아이디 입력 컴포넌트 */
  return pass ? <FindPwdAfter ui_d={id ? id : null} /> : <FindPwdBefore />;
};

export default AuthFindPwd;

