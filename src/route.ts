import express from "express";
import taskRoute from "@modules/tasks/task.route";
import groupRoute from "@modules/groups/group.route";

const router = express.Router();

const defaultRoutes = [
  {
    path: "/tasks",
    route: taskRoute
  },
  {
    path: "/groups",
    route: groupRoute
  }
];

// iterate over the defaultRoutes array and apply each route to the router
defaultRoutes.forEach((each) => {
  router.use(each.path, each.route);
});

export default router;
