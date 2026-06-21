import CategoryList from '@/components/Categories/CategoryList';
import AddCategoryButton from '@/components/Categories/AddCategoryButton';
import ViewTransitionPage from '@/components/ViewTransitionPage';

export default async function CategoriesPage() {
  return (
    <ViewTransitionPage>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-3xl font-bold">Categories</h1>
          <AddCategoryButton />
        </div>

        <CategoryList />
      </div>
    </ViewTransitionPage>
  );
}
