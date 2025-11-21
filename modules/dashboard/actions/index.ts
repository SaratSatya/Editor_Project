"use server"

import { db } from "@/lib/db";
import { currentUser } from "@/modules/auth/actions";

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();
  if (!user) return [];

  try {
    const playgrounds = await db.playground.findMany({
      where: { userId: user.id },
      include: { user: true },
    });

    return playgrounds;
  } catch (error) {
    console.error("Error in getAllPlaygroundForUser:", error);
    return [];
  }
};
