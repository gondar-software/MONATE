import { useDispatch, useSelector } from 'react-redux';

import { setLightMode } from './reducers';

export const useSaveLightMode = () => {
    const dispatch = useDispatch();
    return (lightMode: boolean) => dispatch(setLightMode(lightMode));
};

export const useLightMode = () => {
    return useSelector((state: any) => state.lightMode);
};