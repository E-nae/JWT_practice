import { lazy, useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import useGetMenu from 'api/common/menu';
import { usePro_File } from 'controller/usePro_file';
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import CompLoadable from 'components/CompLoadable';
import { useAuth } from 'context/AuthContext';
import { useEn_Decryption } from 'utils/crypt';

const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const Contact = Loadable(lazy(() => import('pages/extra-pages/Contact')));
const MyAccount = Loadable(lazy(() => import('pages/extra-pages/myPage/myAccount/index')));
const MyHistory = Loadable(lazy(() => import('pages/extra-pages/myPage/history/index')));
const MenuSetting = Loadable(lazy(() => import('pages/extra-pages/menuSetting/index')));
const NoPermission = Loadable(lazy(() => import('components/NoPermission')));
const NotFounded = Loadable(lazy(() => import('pages/authentication//NotFounded')));

interface MenuItem {
  MENU_URL: string;
  MENU_OPTION: string;
  MENU_VIEW: string;
  ALLOWED: string;
}

interface User {
  GRADE?: string;
  ID?: string;
  WORK_TY?: string;
  [key: string]: any;
}

interface Permission {
  ACTION: string;
  USER?: string[];
  TYPE?: string[];
}

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { isError, error, user } = usePro_File();
  const { decrypt } = useEn_Decryption();
  const [us_er, setUs_er] = useState<User>({});
  const [list, setList] = useState<MenuItem[]>([]);
  const { menuList } = useGetMenu();
  
  const updateUser = useCallback(
    (data: User) => {
      setUs_er(data);
    },
    []
  );
  
  const getMenuList = useCallback(async () => {
    // const menuList = await getMenu();
    if (menuList) {
      setList(menuList);
    }
  }, [menuList]);

  useEffect(() => {
    const decryptData = async (data: any) => {
      const profile = await decrypt(data);
      updateUser(profile);
    };
    if (user) {
      decryptData(user);
      getMenuList();
    }
  }, [user, decrypt, updateUser, getMenuList]);

  if (isError) {
    console.log(`에러 발생: ${error?.message}`);
    return null;
  }

  const createList = (arr: MenuItem[]) => {
    const list = arr
      .map((ele) => {
        const paths = ele.MENU_URL.split('/');
        const Comp = paths && CompLoadable(lazy(() => import(`pages/essential-pages/${paths.join('/')}`)));
        const block = () => {
          const permissions: Permission[] = JSON.parse(ele.ALLOWED);
          if (Number(us_er?.GRADE) >= Number(ele?.MENU_VIEW)) {
            const forbidden = permissions?.filter((ele) => ele?.ACTION === 'NOT');
            if (forbidden[0]?.USER?.includes(us_er.ID || '') || forbidden[0]?.TYPE?.includes(us_er?.WORK_TY || '')) {
              return <NoPermission />;
            } else return <Comp />;
          } else {
            const allowList = permissions?.filter((ele) => ele?.ACTION === 'USE' || ele?.ACTION === 'VIEW');
            const isAllowed = allowList?.map((item) => item.USER?.includes(us_er?.ID || '') || item.TYPE?.includes(us_er?.WORK_TY || ''));
            const allowed = isAllowed.some((allow) => allow === true);
            if (allowed) {
              return <Comp />;
            } else return <NoPermission />;
          }
        };
        return {
          path: ele.MENU_URL,
          option: ele.MENU_OPTION,
          view: ele.MENU_VIEW,
          element: us_er && block()
        };
      })
      .filter(Boolean); // null 제거
    return list;
  };

  const mainRoutes = {
    path: '/',
    element: isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace={true} />,
    children: [
      {
        path: '/',
        element: <DashboardDefault />
      },
      {
        path: 'dashboard',
        element: <Navigate to="/" replace={true} />,
        children: [
          {
            path: 'main',
            element: <DashboardDefault />
          }
        ]
      },
      {
        path: 'contact',
        element: <Contact />
      },
      {
        path: 'myaccount',
        element: <MyAccount />
      },
      {
        path: 'myhistory',
        element: <MyHistory />
      },
      ...createList(list),
      {
        path: '*',
        element: <NotFounded />
      }
    ]
  };
  return mainRoutes;
};

export default MainRoutes;

