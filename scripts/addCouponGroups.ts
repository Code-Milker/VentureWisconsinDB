import { PrismaClient } from "../prisma";

// Define creative group names based on the actual listing categories and descriptions
export const generateGroups = async (prisma: PrismaClient) => {
  const groups = [
    {
      groupName: "Historic Coffee Experiences",
      activationCode: "HISTCOFFEE2024",
      description:
        "Step into Wisconsin's most charming coffeehouses, each with a story and a brew to tell.",
    },
    {
      groupName: "Wisconsin Supper Club Legends",
      activationCode: "SUPPERLEGENDS2024",
      description:
        "Experience the tradition of Wisconsin's finest supper clubs with hearty meals and signature cocktails.",
    },
    {
      groupName: "Locally Sourced Coffee Pass",
      activationCode: "LOCALSIP2024",
      description:
        "Explore coffee shops committed to sustainable and locally sourced ingredients across Wisconsin.",
    },
    {
      groupName: "Northwoods Dining & Supper Clubs",
      activationCode: "NORTHWOODS2024",
      description:
        "Discover cozy Northwoods dining experiences, where history and nature combine with delicious meals.",
    },
    {
      groupName: "Farm-to-Table Dining",
      activationCode: "FARMFRESH2024",
      description:
        "Indulge in fresh, locally-sourced dishes from cafes and restaurants that care about their ingredients.",
    },
    {
      groupName: "Craft Coffee and Creativity",
      activationCode: "CRAFTCOFFEE2024",
      description:
        "Savor the art of coffee making in creative spaces that blend food, art, and unique experiences.",
    },
    {
      groupName: "Wisconsin's Prime Steakhouses",
      activationCode: "PRIMESTEAK2024",
      description:
        "Enjoy premium steaks and prime rib from the best steakhouses in the state.",
    },
    {
      groupName: "Classic Fish Fry & Seafood Delights",
      activationCode: "FISHFRY2024",
      description:
        "Taste the best Wisconsin has to offer with its beloved Friday Fish Fry and fresh seafood dishes.",
    },
  ];

  try {
    for (const group of groups) {
      await prisma.groups.create({ data: group });
    }
    console.log("Groups created successfully.");
  } catch (e) {
    console.error("Failed to create groups:", e);
  } finally {
    await prisma.$disconnect();
  }
};
