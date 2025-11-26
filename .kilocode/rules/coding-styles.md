# Components

- Use useMemo and useCallback to fix linting errors, otherwise defer memoization to the react compiler.
- Always put components in their own folder. For example, `components/Dashboard/Dashboard.tsx`
- Extract logic into custtom hooks and utils.
- Keep component specific hooks and utils in the componentt folder. For example, `components/Dashboard/hooks/use-dashboard.ts`. Reusable hooks and utils should be in the `hooks` and `utils` folders.

# General coding styles

- Alawys wrap code in curly braces, even if it's a single line.

# Files

- Keep files less then 300 hunders lines of code. Blank lines and comments are not counted.
- Use kebab-case for file names, except for components, which should be PascalCase.
- All folders containing multiple exported modules must include a barrel file that re-exports these modules. Within every barrel file, exported identifiers must be ordered alphabetically by export name.
