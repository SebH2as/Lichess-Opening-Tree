const OpeningReducer = (state, action) => {
    switch(action.type){
        case 'GET_OPEN':
            return {
                ...state,
                opening: action.payload,
                loading: false
            }
            case 'CLEAR_OPEN':
                return {
                    ...state,
                    opening: [],
                }
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            }

        default:
            return state
    }
}

export default OpeningReducer