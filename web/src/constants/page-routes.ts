export const PAGE_ROUTES = {
  home: "/",
  signup: "/signup",
  login: "/login",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  tasks: "/tasks",
  createTask: "/tasks/create",
  taskDetails: (id: string) => `/tasks/${id}`,
  myBidTask: (taskId: string) => `/my-bids/${taskId}`,
  howItWorks: "/how-it-works",
};
