import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    membershipPlan: "CLASSIC",
    validTill: "31 Jan 2024",
  },
  {
    name: "John",
    email: "john@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    membershipPlan: "CLASSIC",
    validTill: "31 Jan 2024",
  },
  {
    name: "Joe",
    email: "joe@email.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: false,
    membershipPlan: "CLASSIC",
    validTill: "31 Jan 2024",
  },
];

export default users;
