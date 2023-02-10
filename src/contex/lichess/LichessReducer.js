const LichessReducer = (state, action) => {
    switch(action.type){
        case 'GET_GAMES':
            return {
                ...state,
                games: action.payload,
                loading: false
            }
            case 'CLEAR_GAMES':
                return {
                    ...state,
                    games: [],
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

export default LichessReducer