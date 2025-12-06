export const PAGE_ROUTES = {
  home: "/",
  signup: "/signup",
  login: "/login",
  dashboard: "/dashboard",
  tasks: "/tasks",
  tasksMap: "/tasks/map",
  taskDetails: (id: string) => `/tasks/${id}`,
  howItWorks: "/how-it-works",
};
