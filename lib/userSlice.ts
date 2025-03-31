import {createSelector, createSlice} from "@reduxjs/toolkit";
interface StateInterface {
    userName: string | null;
    email: string | null;
    avatar_url: string | null;
}
const initialState: StateInterface = {
    userName: null,
    email: null,
    avatar_url: null,
};
const userInformation = createSlice({
    name: "current_user",
    initialState,
    reducers: {
        setUserInfomation: (
            state: StateInterface,
            action: {payload: Pick<StateInterface, "email" | "userName" | "avatar_url">},
        ) => {
            const {userName, email, avatar_url} = action.payload;
            state.userName = userName;
            state.email = email;
            state.avatar_url = avatar_url;
        },
    },
});

export const {setUserInfomation} = userInformation.actions;

export default userInformation.reducer;
const selectCurrentUserState = (state: any) => state.userInformation;

export const selectCurrentUser = createSelector(
    [selectCurrentUserState],
    userInformation => ({
        userName: userInformation.userName,
        email: userInformation.email,
        avatar_url: userInformation.avatar_url,
        name: userInformation.name,
    }),
);
