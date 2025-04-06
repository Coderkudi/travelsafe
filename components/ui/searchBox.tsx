import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLazyFetchLandmarksQuery, useLazyFetchSafetyDataQuery } from "@/lib/user";
import { useDispatch, useSelector } from "react-redux";
import { selectLocationState, selectsafetyData } from "@/lib/userSlice";
import { SafetyDataType } from "@/types/SafetyData";
function searchBox() {
    const dispatch = useDispatch();
    const safetyDataFromRedux: SafetyDataType = useSelector(selectsafetyData);

    const [destination, setDestination] = useState(
        safetyDataFromRedux.location || "price,france",
    );
    const [loading, setLoading] = useState(false);
    const [locationInfo, { data, error, isLoading }] = useLazyFetchSafetyDataQuery();
    const [fetchLandMark, { data: AiLandMarks, error: AiLandMarksError }] =
        useLazyFetchLandmarksQuery();
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        locationInfo(destination);
    };
    useEffect(() => {
        setLoading(isLoading);

        try {
            if (data) {
                dispatch({
                    type: "locationInformation/setSafetyData",
                    payload: {
                        safetyData: data,
                    },
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log("Error fetching safety data", error.message);
            }
        } finally {
            setLoading(false);
        }
    }, [data, error, isLoading]);
    const selectSafetyData = useSelector(selectsafetyData);
    useEffect(() => {
        if (selectSafetyData) {
            fetchLandMark(selectSafetyData.location);
        }
    }, [selectSafetyData]);
    useEffect(() => {
        if (AiLandMarks) {
            dispatch({
                type: "locationInformation/setLandmarks",
                payload: {
                    landmarks: AiLandMarks,
                },
            });
        }
    }, [AiLandMarks, AiLandMarksError]);

    return (
        <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto mb-8 gap-2">
            <div className="flex-1">
                <Label htmlFor="destination" className="sr-only">
                    Destination
                </Label>
                <Input
                    id="destination"
                    placeholder="Enter destination (city, country)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-purple-950/60 border-purple-800 placeholder:text-purple-300/50 text-white"
                />
            </div>
            <Button
                type="submit"
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
            >
                {loading ? "Loading..." : <Search className="h-4 w-4 mr-2" />}
                Search
            </Button>
        </form>
    );
}

export default searchBox;
