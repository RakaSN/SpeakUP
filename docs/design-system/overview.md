# SpeakUp Design System (SDS v1.0) Documentation

## Overview
**SpeakUp Design System (SDS v1.0)** adalah bahasa visual tunggal dan pustaka komponen UI terstandarisasi untuk platform pengaduan & konseling SpeakUp.

SDS v1.0 dirancang dengan 4 pilar utama:
1. **Semantic Design Tokens** (`globals.css` dengan OKLCH light & dark mode).
2. **Component Library Modular** (dengan barrel export `@/components/ui`).
3. **UX State Engine** (Standardized `loading`, `empty`, `success`, `error`, `forbidden` handling via `<StateWrapper />`).
4. **Accessibility (a11y)** (WCAG AA Contrast, Keyboard Focus Rings, ARIA Roles, Reduced Motion).

---

## 📦 Component Library Registry (`@/components/ui`)

```typescript
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Input,
  Skeleton,
  EmptyState,
  ErrorState,
  ForbiddenState,
  StateWrapper,
  Spinner,
  Divider,
  Avatar,
  PageHeader,
} from '@/components/ui';
```

---

## 🎨 Semantic Token Layer (`globals.css`)

* `--background` / `--foreground`: Background utama halaman.
* `--surface` / `--surface-muted`: Card background & neutral containers.
* `--primary` / `--primary-foreground`: Action warna utama SpeakUp.
* `--success` / `--warning` / `--destructive` / `--info`: Status feedback badges & alerts.

---

## 🔄 UX State Engine Standard (`<StateWrapper />`)

Setiap halaman / fitur wajib menggunakan `<StateWrapper />` untuk merender 5 UX State secara konsisten:

```tsx
<StateWrapper
  state={isLoading ? 'loading' : isError ? 'error' : data.length === 0 ? 'empty' : 'success'}
  emptyTitle="Belum ada pengaduan"
  emptyDescription="Klik tombol di bawah untuk membuat laporan pengaduan baru."
  onRetry={() => refetch()}
>
  <TicketList items={data} />
</StateWrapper>
```

---

## ♿ Accessibility Guidelines
* Seluruh elemen interaktif wajib memiliki **Visible Focus Rings** (`focus-visible:ring-2 focus-visible:ring-ring`).
* Seluruh ikon dekoratif SVG wajib menambahkan `aria-hidden="true"`.
* Animasi wajib menghormati `motion-reduce:animate-none` dan `motion-reduce:transition-none`.
