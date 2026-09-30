import { redirect } from "next/navigation";

export default function ExperiencesRedirect() {
  redirect("/admin/initiatives?type=EXPERIENCE");
}
