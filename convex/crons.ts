import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval("poll-spotify", { minutes: 1 }, internal.spotify.refreshNowPlaying);

export default crons;
