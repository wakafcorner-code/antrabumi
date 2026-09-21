"use server";

import { revalidatePath } from "next/cache";
import { Role, MessageStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { updateMessageStatus } from "@/server/repositories/message.repository";

export async function changeMessageStatusAction(id: string, status: MessageStatus) {
  await requireUser(Role.EDITOR);
  await updateMessageStatus(id, status);
  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
  return { success: true };
}
