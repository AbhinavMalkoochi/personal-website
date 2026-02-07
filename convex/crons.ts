import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("poll-spotify", { seconds: 15 }, internal.spotify.pollNowPlaying);

export default crons;
