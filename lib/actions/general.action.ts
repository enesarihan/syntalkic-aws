"use server";

import { db } from "@/firebase/admin";

export async function getSyntalkicByUserId(
  userId: string
): Promise<Syntalkic[] | null> {
  const syntalkics = await db
    .collection("syntalkics")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return syntalkics.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Syntalkic[];
}

export async function getLatestSyntalkics(
  params: GetLatestSyntalkicsParams
): Promise<Syntalkic[] | null> {
  const { userId, limit = 20 } = params;

  const syntalkics = await db
    .collection("syntalkics")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return syntalkics.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Syntalkic[];
}

export async function getSyntalkicById(id: string): Promise<Syntalkic | null> {
  const syntalkic = await db.collection("syntalkics").doc(id).get();

  return syntalkic.data() as Syntalkic | null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const user = await db.collection("users").doc(userId).get();

  return user.data() as User | null;
}
