import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	value: [],
};

export const hiddensSlice = createSlice({
	name: 'hiddenArticles',
	initialState,
	reducers: {
		hideArticle: (state, action) => {
			state.value.push(action.payload);
		},
		resetHidden: (state) => {
            state.value = []
        }
	},
});

export const { hideArticle, resetHidden } = hiddensSlice.actions;
export default hiddensSlice.reducer;
