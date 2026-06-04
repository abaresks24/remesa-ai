import { RecipientView } from "@/components/RecipientView";

export default async function RecibirPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ r?: string }>;
}) {
  const { code } = await params;
  const { r } = await searchParams;
  return <RecipientView code={code} encoded={r} />;
}
