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
const NoticeDetailView = Loadable(lazy(() => import('pages/essential-pages/bod/lst/req/bo_id/notice/DetailView')));
const PolicyDetailView = Loadable(lazy(() => import('pages/essential-pages/bod/lst/req/bo_id/policy/DetailView')));
const RefreshToken = Loadable(lazy(() => import('pages/extra-pages/apiRefreshToken/index')));

const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const TestBoard = Loadable(lazy(() => import('pages/extra-pages/test/Test')));
const Batch_status = Loadable(lazy(() => import('pages/extra-pages/test/batch/BatchStatusChg')));
const PubMonitoring = Loadable(lazy(() => import('pages/extra-pages/pubMonitoring/index')));
const DailySalesByService = Loadable(lazy(() => import('pages/essential-pages/sales2/daily')));

const ModalContent = Loadable(lazy(() => import('pages/essential-pages/member/pubtel_member_list/modal/ModalIndex')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { isError, error, user } = usePro_File();
  const { decrypt } = useEn_Decryption();
  const [us_er, setUs_er] = useState({});
  const [list, setList] = useState([]);
  const { menuList } = useGetMenu();
  const updateUser = useCallback(
    (data) => {
      setUs_er(data);
    },
    [setUs_er]
  );
  const getMenuList = useCallback(async () => {
    // const menuList = await getMenu();
    menuList && setList(menuList);
  }, [menuList]);

  useEffect(() => {
    const decryptData = async (data) => {
      const profile = await decrypt(data);
      updateUser(profile);
    };
    if (user) {
      decryptData(user);
      getMenuList();
    }
  }, [user, decrypt, updateUser, getMenuList]);

  if (isError) return console.log(`에러 발생: ${error.message}`);

  const createList = (arr) => {
    const list = arr
      .map((ele) => {
        const paths = ele.MENU_URL.split('/');
        const Comp = paths && CompLoadable(lazy(() => import(`pages/essential-pages/${paths.join('/')}`)));
        const block = () => {
          const permissions = JSON.parse(ele.ALLOWED);
          if (Number(us_er?.GRADE) >= Number(ele?.MENU_VIEW)) {
            const forbidden = permissions?.filter((ele) => ele?.ACTION === 'NOT');
            if (forbidden[0]?.USER?.includes(us_er.ID) || forbidden[0]?.TYPE?.includes(us_er?.WORK_TY)) {
              return <NoPermission />;
            } else return <Comp />;
          } else {
            const allowList = permissions?.filter((ele) => ele?.ACTION === 'USE' || ele?.ACTION === 'VIEW');
            const isAllowed = allowList?.map((item) => item.USER?.includes(us_er?.ID) || item.TYPE?.includes(us_er?.WORK_TY));
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
        path: 'color',
        element: <Color />
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
      {
        path: 'menu_setting',
        element: <MenuSetting />
      },
      {
        path: 'svc_notice/board_detail/:wr_id',
        element: <NoticeDetailView />
      },
      {
        path: 'svc_policy/board_detail/:wr_id',
        element: <PolicyDetailView />
      },
      {
        path: 'test_board',
        element: <TestBoard />
      },
      {
        path: 'batch_status',
        element: <Batch_status />
      },
      {
        path: 'pubtelphone/monitoring',
        element: <PubMonitoring />
      },
      {
        path: 'sales2/daily',
        element: <DailySalesByService />
      },
      {
        path: 'member/pubtel_member_list/:uid',
        element: <ModalContent />
      },
      {
        path: '/reissue/refreshtk',
        element: <RefreshToken />
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
