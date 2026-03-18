import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminScreenTimeRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/admin-panel/company-benefits/${id}/screen-time`);
}
