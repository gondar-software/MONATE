import { FollowerData } from "@app/types";

export interface FollowingData {
    followers?: FollowerData[];
    rate: number;
    count: number;
}