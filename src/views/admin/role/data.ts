export default [
  {
    rolename: "ROLE_ADMIN",
    permissions: ["Create"]
  },
  {
    rolename: "ROLE_MODERATOR",
    permissions: ["Create", "Update"]
  },
  {
    rolename: "ROLE_USER",
    permissions: ["Create", "Delete"]
  }
];
