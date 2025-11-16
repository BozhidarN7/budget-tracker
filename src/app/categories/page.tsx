import { redirect } from 'next/navigation';
import ProtectedAppLayout from '@/components/ProtectedAppLayout';
import { getCurrentUser } from '@/utils/server-auth';
import CategoryList from '@/components/Categories/CategoryList';
import AddCategoryButton from '@/components/Categories/AddCategoryButton';

export default async function CategoriesPage() {
  const result = await getCurrentUser();

  if (!result) {
    redirect('/login');
  }

  const { user } = result;

  return (
    <ProtectedAppLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <AddCategoryButton />
        </div>

        <CategoryList />
      </div>
    </ProtectedAppLayout>
  );
}
