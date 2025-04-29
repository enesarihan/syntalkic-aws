"use server";

import { db } from "@/firebase/admin";

export async function getSyntalkicByUserId(
  userId: string,
  limit = 30,
  lastCreatedAt?: FirebaseFirestore.Timestamp
): Promise<Syntalkic[]> {
  let query = db
    .collection("syntalkics")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(limit);

  if (lastCreatedAt) {
    query = query.startAfter(lastCreatedAt);
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Syntalkic[];
}

export async function getLatestSyntalkics({
  userId,
  limit = 30,
  lastCreatedAt,
}: {
  userId: string;
  limit?: number;
  lastCreatedAt?: FirebaseFirestore.Timestamp;
}): Promise<Syntalkic[]> {
  let query = db
    .collection("syntalkics")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .orderBy("createdAt", "desc")
    .limit(limit);

  if (lastCreatedAt) {
    query = query.startAfter(lastCreatedAt);
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => ({
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
