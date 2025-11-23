/* eslint-disable prettier/prettier */
import { lazy, ReactElement } from "react";
import Loadable from "components/Loadable";

export const matchId = async (url: string): Promise<ReactElement> => {
    let result: ReactElement = <> 작업 중: {url} </>;
    const paths = url.split('/');
    if(paths) {
        try {
            const Comp = Loadable(lazy(() => import(`pages/essential-pages/${paths.join('/')}`)));
            result = <Comp />; // await 키워드를 사용하는 위치가 비동기 함수 내부에 있어야 함.
            return result;
        } catch (error) {
            console.error('Error loading component:', error);
            result = (
                <div>Error: 컴포넌트를 로드할 수 없습니다.</div>
            );
            return result;
        }
    }
    console.log(result);
    return result;
};

