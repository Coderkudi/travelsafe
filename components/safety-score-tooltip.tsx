import type React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import type { SafetyDataType, safetyScore } from "@/types/SafetyData";
import { useSelector } from "react-redux";
import { selectsafetyData, selectsafetyScore } from "@/lib/userSlice";
import { useEffect, useState } from "react";

interface ScoreCategoryProps {
    title: string;
    scores: Record<string, number>;
    maxScore: number;
}

const ScoreCategory = ({ title, scores, maxScore }: ScoreCategoryProps) => {
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const maxPossible = Object.keys(scores).length * maxScore;
    const percentage = Math.round((totalScore / maxPossible) * 100);

    return (
        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <h4 className="font-medium text-white">{title}</h4>
                <span className="text-sm text-purple-200">
                    {totalScore}/{maxPossible} ({percentage}%)
                </span>
            </div>
            <div className="space-y-1">
                {Object.entries(scores).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                        <span className="text-purple-300">{formatCamelCase(key)}</span>
                        <span className="text-purple-200">
                            {value}/{maxScore}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Helper function to format camelCase to readable text
const formatCamelCase = (text: string) => {
    return text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
};

export function SafetyScoreTooltip({ children }: { children: React.ReactNode }) {
    // This is a mock safety score for demonstration
    // In a real implementation, you would fetch this from your Redux store or API
    const safetyScoreFromRedux = useSelector(selectsafetyScore);
    // const
    // We'll use a dummy safety score for now

    const dummySafetyScore: safetyScore = {
        publicSafety: {
            crimeRate: 3,
            emergencyResponse: 4,
            policePresence: 3,
            NeighborhoodSafety: 3,
            NighttimeSafety: 2,
        },
        healthSafety: {
            airQuality: 3,
            waterQuality: 4,
            foodHygiene: 3,
            accessToHealthcare: 4,
            diseasePrevalence: 3,
        },
        natureRisk: {
            naturalDisasters: 4,
            wildlifeEncounters: 4,
            environmentalHazards: 3,
            climateChangeImpact: 3,
            uvIndex: 2,
        },
        CultureAndLegalAwareness: {
            lawsAndRegulations: 3,
            culturalNorms: 3,
            localCustoms: 3,
            languageBarrier: 2,
            legalAssistance: 3,
        },
        techSafety: {
            dataPrivacy: 3,
            cyberSecurity: 3,
            digitalFraud: 3,
            onlineHarassment: 4,
            techSupport: 3,
        },
    };
    const [safetyScore, setSafetyScore] = useState<safetyScore>(dummySafetyScore);
    useEffect(() => {
        if (safetyScoreFromRedux) {
            setSafetyScore(safetyScoreFromRedux);
        } else {
            setSafetyScore(dummySafetyScore);
        }
    }, [safetyScoreFromRedux]);

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <div className="cursor-help relative">
                        {children}
                        <div className="absolute top-2 right-2 text-purple-400">
                            <Info size={16} />
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent
                    side="right"
                    className="w-80 p-4 bg-purple-950/90 border-purple-800 backdrop-blur-sm"
                >
                    <div className="space-y-3">
                        <h3 className="font-bold text-white text-lg flex items-center justify-between">
                            Safety Score Breakdown
                            <span className="text-purple-300 text-sm font-normal">
                                Score out of 4
                            </span>
                        </h3>

                        <ScoreCategory
                            title="Public Safety"
                            scores={safetyScore.publicSafety}
                            maxScore={4}
                        />

                        <ScoreCategory
                            title="Health Safety"
                            scores={safetyScore.healthSafety}
                            maxScore={4}
                        />

                        <ScoreCategory
                            title="Nature Risk"
                            scores={safetyScore.natureRisk}
                            maxScore={4}
                        />

                        <ScoreCategory
                            title="Culture & Legal"
                            scores={safetyScore.CultureAndLegalAwareness}
                            maxScore={4}
                        />

                        <ScoreCategory
                            title="Tech Safety"
                            scores={safetyScore.techSafety}
                            maxScore={4}
                        />

                        <div className="pt-2 text-xs text-purple-300 border-t border-purple-800">
                            Safety Index is calculated by combining scores across all
                            categories, with each metric rated from 0 (very poor) to 4
                            (excellent).
                        </div>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
