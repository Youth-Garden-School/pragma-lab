# Tài liệu hướng dẫn dự án

## Quy tắc đặt tên branch

Các loại branch được phép sử dụng:

- `dev` - Branch chính cho development
- `staging` - Branch cho môi trường staging
- `release/vX.X` - Branch cho version release (VD: release/v1.0)
- `feature/{initials}_{feature-name}` - Branch cho tính năng mới (VD: feature/sh_onboarding)
- `hotfix/{hotfix-name}` - Branch cho fix lỗi khẩn cấp (VD: hotfix/fix-login)

## Quy tắc Commit

### Cấu trúc commit message

```
<type>: <subject>

<body>
```

### Các loại type:

- `feat`: Thêm tính năng mới
- `fix`: Sửa lỗi
- `docs`: Thay đổi tài liệu
- `style`: Thay đổi không ảnh hưởng tới code (định dạng, khoảng trắng, etc)
- `refactor`: Tái cấu trúc code không thêm tính năng hay fix bug
- `perf`: Cải thiện hiệu năng
- `test`: Thêm hoặc sửa test
- `build`: Thay đổi hệ thống build hoặc dependencies
- `ci`: Thay đổi CI configuration
- `chore`: Các thay đổi khác không liên quan đến src hay test
- `revert`: Hoàn tác commit trước đó
- `merge`: Merge code

## Cấu trúc thư mục

```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/             # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/        # Protected routes
│   └── layout.tsx          # Root layout
│
├── components/                    # Components dùng chung cho toàn bộ dự án
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   └── Form/
│       ├── Input/
│       │   ├── Input.tsx
│       └── Select/
│           ├── Select.tsx
│
├── features/
│   └── Auth/
│       ├── application/
│       │   ├── services/
│       │   │   ├── IAuthService.ts
│       │   │   └── implements/
│       │   │       └── AuthService.ts
│       │   └── queries/                 # React Query hooks và mutations
│       │       ├── useLogin.ts          # Login mutation hook
│       │       ├── useRegister.ts       # Register mutation hook
│       │       ├── useUser.ts           # Query hook for user data
│       │       └── types/
│       │           ├── LoginParams.ts
│       │           └── RegisterParams.ts
│       │
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── User.ts
│       │   │   └── Token.ts
│       │   ├── constants/
│       │   └── dto/
│       │
│       ├── infrastructure/
│       │   ├── repositories/
│       │   │   ├── IUserRepository.ts
│       │   │   ├── ITokenRepository.ts
│       │   │   └── implements/
│       │   │       ├── UserRepository.ts
│       │   │       └── TokenRepository.ts
│       │   └── services/
│       │       ├── IJWTService.ts
│       │       ├── IPasswordHasher.ts
│       │       ├── IEmailService.ts
│       │       └── implements/
│       │           ├── JWTService.ts
│       │           ├── BCryptPasswordHasher.ts
│       │           └── NodemailerEmailService.ts
│       │
│       └── presentation/        # UI theo Atomic Design
│           ├── atoms/          # Các component nhỏ nhất
│           │   ├── Button.tsx
│           │   └── Input.tsx
│           ├── molecules/      # Kết hợp từ atoms
│           │   ├── FormField.tsx
│           │   └── SearchBar.tsx
│           ├── organisms/      # Kết hợp từ molecules
│           │   ├── LoginForm.tsx
│           │   └── RegisterForm.tsx
│           └── pages/         # Complete pages
│               ├── LoginPage.tsx
│               └── RegisterPage.tsx
│
├── pages/                      # Next.js pages và API routes
│   ├── api/                   # Backend API endpoints
│   │   └── auth/
│   │       ├── login.ts
│   │       └── register.ts
│   │
└── shared/                    # Logic dùng chung
    ├── constants/
    │   └── api.ts
    ├── helpers/
    │   └── validation.ts
    ├── hooks/
    │   └── useForm.ts
    ├── types/
    │   └── common.ts
    └── utils/
        ├── api.ts
        └── storage.ts
```

### Quy tắc tổ chức feature module

1. **Tên module**: Viết hoa chữ cái đầu (PascalCase)
2. **Cấu trúc module**: Tuân thủ DDD layers

   - `application`: Logic nghiệp vụ
   - `domain`: Models và interfaces
   - `infrastructure`: Implement các interface
   - `presentation`: UI components

3. **Tổ chức internal**: Người phụ trách module có thể tự do tổ chức cấu trúc bên trong mỗi layer theo cách phù hợp nhất với module đó

4. **Nguyên tắc chung**:
   - Mỗi module là độc lập
   - Không import trực tiếp giữa các module
   - Giao tiếp qua interfaces định nghĩa trong domain layer
   - Shared code đặt trong thư mục `shared`

## Kiến trúc FullStack

### Frontend (App Router)

```
src/
├── app/                     # Next.js 14 App Router
│   ├── (auth)/             # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/        # Protected routes
│   └── layout.tsx          # Root layout
│
├── components/             # Shared components
└── features/              # Feature modules
```

### Backend (Pages Router)

```
src/
├── pages/
│   └── api/               # API Routes with Pages Router
│       ├── auth/
│       │   ├── login.ts
│       │   └── register.ts
│       └── [...trpc].ts   # tRPC API handler
│
```

### Database Structure

```
prisma/
├── schema.prisma          # Prisma schema
└── migrations/            # Migration files
```

### Cấu hình môi trường

```env
NEXT_PUBLIC_API_BASE_URL=<your_api_base_url>

DATABASE_URL=<your_database_url>
```

## Các package chính được sử dụng

### Dependencies

```json
{
  "@reduxjs/toolkit": "^2.8.2",
  "@tanstack/react-query": "^5.77.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "commitlint": "^19.8.1",
  "inversify": "^7.5.1",
  "lucide-react": "^0.511.0",
  "next": "15.1.8",
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-hook-form": "^7.56.4",
  "react-redux": "^9.2.0",
  "redux-persist": "^6.0.0",
  "reflect-metadata": "^0.2.2",
  "tailwind-merge": "^3.3.0",
  "tailwindcss-animate": "^1.0.7",
  "zod": "^3.25.28"
}
```

### DevDependencies

```json
{
  "@commitlint/cli": "^19.7.1",
  "@commitlint/config-conventional": "^19.7.1",
  "@commitlint/types": "^19.5.0",
  "@eslint/eslintrc": "^3",
  "@eslint/js": "^9.27.0",
  "@faker-js/faker": "^9.5.1",
  "@testing-library/dom": "^10.4.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/react": "^16.2.0",
  "@types/bcrypt": "^5.0.2",
  "@types/jest": "^29.5.14",
  "@types/lodash": "^4.17.16",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "@types/redux-persist": "^4.0.0",
  "@types/yup": "^0.29.14",
  "@typescript-eslint/eslint-plugin": "^8.25.0",
  "@typescript-eslint/parser": "^8.25.0",
  "autoprefixer": "^10.4.21",
  "conventional-changelog-atom": "^5.0.0",
  "eslint": "^9.23.0",
  "eslint-config-next": "^15.1.7",
  "eslint-config-prettier": "^10.0.2",
  "eslint-plugin-import": "^2.31.0",
  "eslint-plugin-prettier": "^5.2.3",
  "eslint-plugin-unused-imports": "^4.1.4",
  "husky": "^9.1.7",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "lint-staged": "^15.4.3",
  "postcss": "^8.5.3",
  "prettier": "^3.5.2",
  "prettier-plugin-tailwindcss": "^0.6.11",
  "prisma": "^6.4.1",
  "ts-jest": "^29.2.6",
  "ts-node": "^10.9.2",
  "tsx": "^4.19.3",
  "typescript": "^5.8.2"
}
```

## Quy tắc code

1. **Naming Conventions**

   - Sử dụng camelCase cho tên biến và hàm
   - Sử dụng PascalCase cho tên component và interface
   - Sử dụng UPPERCASE cho constants

2. **Component Structure**

   - Mỗi component một file
   - Tên file phải trùng với tên component
   - Sử dụng Functional Components với TypeScript

3. **Hooks Order**

   - `useState` luôn đặt đầu tiên, nhóm các state liên quan
   - `useRef` đặt sau useState
   - Custom hooks và hooks từ thư viện (useQuery, useForm, etc.)
   - `useEffect` đặt sau cùng
   - Functions là dependencies của useEffect phải đặt trước useEffect
   - Các functions khác đặt sau useEffect
   - Mỗi nhóm hooks/functions cách nhau 1 dòng trống

   Ví dụ:

   ```typescript
   const Component = () => {
     const [data, setData] = useState<Data[]>([]);
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState<Error | null>(null);

     const tableRef = useRef<HTMLTableElement>(null);
     const timeoutRef = useRef<NodeJS.Timeout>();

     const { data: queryData } = useQuery(['key'], fetchData);
     const { handleSubmit, register } = useForm<FormData>();

     const handleDataUpdate = useCallback(() => {
       // Function là dependency của useEffect
       setData(queryData);
     }, [queryData]);

     useEffect(() => {
       handleDataUpdate();
     }, [handleDataUpdate]);

     useEffect(() => {
       // other effects
     }, []);

     const handleReset = () => {
       // Function không liên quan đến effect
       setData([]);
       setLoading(false);
     };

     return (...);
   };
   ```

4. **Import Order**

   - React imports
   - Third party libraries
   - Components
   - Hooks
   - Utils/Constants
   - Types
   - Styles

5. **Testing**
   - Unit test cho các utility functions
   - Component testing với React Testing Library
   - Coverage tối thiểu 80%

## Quy tắc chạy dự án

1. **Khởi động dự án**

   ```bash
   # Cài đặt dependencies
   pnpm install

   # Chạy development server
   pnpm dev
   ```

2. **Trước khi commit code**

   ```bash
   # Format code
   pnpm format

   # Kiểm tra lỗi
   pnpm lint
   ```

3. **Trước khi push code**

   ```bash
   # Build dự án để kiểm tra lỗi
   pnpm build
   ```

4. **Quy trình làm việc**
   - Luôn chạy `pnpm dev` khi phát triển
   - Format code trước khi commit
   - Build project trước khi push
   - Không push code có lỗi build

## Scripts có sẵn

```bash
# Cài đặt dependencies
pnpm install

# Khởi chạy development server
pnpm dev

# Build production
pnpm build

# Chạy unit tests
pnpm test

# Kiểm tra linting
pnpm lint

# Format code
pnpm format

pnpm lint-staged
```

## Quy trình review code

1. Tạo branch mới từ `develop`
2. Code và commit theo quy tắc
3. Push và tạo Pull Request
4. Yêu cầu ít nhất 1 reviewer
5. Sau khi được approve, merge vào `develop`

## Ví dụ về interface cho repository:

```typescript
// IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(user: CreateUserDTO): Promise<User>
  update(id: string, data: UpdateUserDTO): Promise<User>
  delete(id: string): Promise<void>
}

// ITokenRepository.ts
export interface ITokenRepository {
  createToken(userId: string, token: string): Promise<Token>
  findByToken(token: string): Promise<Token | null>
  deleteToken(token: string): Promise<void>
}
```

## Ví dụ về interface cho service:

```typescript
// IAuthService.ts
export interface IAuthService {
  login(credentials: LoginDTO): Promise<AuthResult>
  register(userData: RegisterDTO): Promise<AuthResult>
  logout(token: string): Promise<void>
  verifyToken(token: string): Promise<boolean>
}

// IPasswordHasher.ts
export interface IPasswordHasher {
  hash(password: string): Promise<string>
  compare(password: string, hash: string): Promise<boolean>
}
```

## Ví dụ về React Query hook:

```typescript
// useLogin.ts
import { useMutation } from '@tanstack/react-query'
import type { LoginParams, AuthResult } from './types'
import { authService } from '../services/implements/AuthService'

export const useLogin = () => {
  return useMutation<AuthResult, Error, LoginParams>({
    mutationFn: (params) => authService.login(params),
    onSuccess: (data) => {
      // Handle successful login
    },
  })
}

// useUser.ts
import { useQuery } from '@tanstack/react-query'
import type { User } from '../../domain/entities/User'

export const useUser = (userId: string) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => authService.getUser(userId),
    enabled: !!userId,
  })
}
```

## Liên hệ

Nếu có thắc mắc, vui lòng liên hệ team lead hoặc tạo issue trong repository.
