import initialStates from './initial-states';

export const SET_LIGHT_MODE = 'SET_LIGHT_MODE';

const reducer = (state = initialStates, action: any) => {
    switch (action.type) {
        case SET_LIGHT_MODE:
            return {
                ...state,
                lightMode: action.payload,
            };
        default:
            return state;
    }
};

export const setLightMode = (lightMode: boolean) => ({
    type: SET_LIGHT_MODE,
    payload: lightMode,
});

export default reducer;