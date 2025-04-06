import { createSelector, createSlice } from "@reduxjs/toolkit";
interface StateInterface {
    location: {
        name: string | null;
        lat: number;
        lon: number;
    };
}
const initialState: StateInterface = {
    location: {
        name: null,
        lat: 0,
        lon: 0,
    },
};
const locationData = createSlice({
    name: "locationInformation",
    initialState,
    reducers: {
        setLocationInformation: (
            state: StateInterface,
            action: {
                payload: Pick<StateInterface, "location">;
            },
        ) => {
            state.location = action.payload.location;
        },
    },
});

export const { setLocationInformation } = locationData.actions;
export default locationData.reducer;

export const selectLocationState = (state: any) => state.locationInformation;
export const selectLocation = createSelector(
    selectLocationState,
    (state: StateInterface) => state.location,
);
