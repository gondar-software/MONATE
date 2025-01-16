import { useDispatch, useSelector } from 'react-redux';

import { 
    setLightMode,
    setGardenLoaded,
    setOasisLoaded,
    setGardenProgress,
    setOasisProgress,
    setInitialValue,
} from '@app/global';

export const useSaveLightMode = () => {
    const dispatch = useDispatch();
    return (lightMode: boolean) => dispatch(setLightMode(lightMode));
};
export const useSaveGardenLoaded = () => {
    const dispatch = useDispatch();
    return (gardenLoaded: boolean) => dispatch(setGardenLoaded(gardenLoaded));
};
export const useSaveOasisLoaded = () => {
    const dispatch = useDispatch();
    return (oasisLoaded: boolean) => dispatch(setOasisLoaded(oasisLoaded));
};
export const useSaveGardenProgress = () => {
    const dispatch = useDispatch();
    return (gardenProgress: any) => dispatch(setGardenProgress(gardenProgress));
};
export const useSaveOasisProgress = () => {
    const dispatch = useDispatch();
    return (oasisProgress: any) => dispatch(setOasisProgress(oasisProgress));
};

export const useLightMode = () => {
    return useSelector((state: any) => state.lightMode);
};
export const useGardenLoaded = () => {
    return useSelector((state: any) => state.gardenLoaded);
};
export const useOasisLoaded = () => {
    return useSelector((state: any) => state.oasisLoaded);
};
export const useGardenProgress = () => {
    return useSelector((state: any) => state.gardenProgress);
};
export const useOasisProgress = () => {
    return useSelector((state: any) => state.oasisProgress);
};

export const useSetInitialValue = () => {
    const dispatch = useDispatch();
    return () => dispatch(setInitialValue());
};