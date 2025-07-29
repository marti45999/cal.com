/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from "../trpc";
import { viewerRouter } from "./viewer/_router";
import { geoPlannerRouter } from "@/plugins/geo-planner/trpc-router";

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = router({
  viewer: viewerRouter,
  geoPlanner: geoPlannerRouter,
});

export type AppRouter = typeof appRouter;
