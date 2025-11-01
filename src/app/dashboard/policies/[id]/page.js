export default async function Policie({ params }) {
  const { id } = await params;

  console.log(id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">POLIZA</h1>
    </div>
  );
}
