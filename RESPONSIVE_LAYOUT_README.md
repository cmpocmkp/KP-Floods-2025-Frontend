# Responsive Layout System

This document explains the new responsive layout system implemented for the KPD3 React app.

## Overview

The app now features a fully responsive sidebar that:

- On desktop (lg+): Shows as a fixed column with collapse/expand functionality
- On mobile (<lg): Transforms into a slide-over drawer with backdrop
- Maintains all existing functionality and styling
- Provides smooth animations and proper accessibility

## Key Components

### 1. UIContext (`src/contexts/UIContext.tsx`)

Manages global UI state for the sidebar:

- `collapsed`: Desktop sidebar collapse state (persisted to localStorage)
- `mobileOpen`: Mobile drawer open state (not persisted)
- `isMobile`: Current breakpoint detection
- Actions: `toggleCollapsed()`, `openMobile()`, `closeMobile()`

### 2. AppLayout (`src/layouts/AppLayout.tsx`)

Main layout wrapper for protected routes:

- Renders Sidebar and Topbar
- Manages content padding based on sidebar state
- Uses CSS variables for smooth transitions
- Handles signout events

### 3. Topbar (`src/components/Layout/Topbar.tsx`)

Header component with hamburger menu:

- On mobile: Toggles mobile drawer
- On desktop: Toggles sidebar collapse
- Includes proper accessibility attributes

### 4. Sidebar (`src/components/nav/Sidebar.tsx`)

Responsive navigation sidebar:

- Desktop: Fixed column with collapse/expand
- Mobile: Slide-over drawer with backdrop
- Includes focus trap and keyboard navigation
- Auto-closes on route changes (mobile)

### 5. Chart Resize Hook (`src/hooks/useChartResize.ts`)

Handles chart resizing when layout changes:

- Listens for `kpd3:layout:changed` events
- Triggers window resize events for Recharts
- Can be used in chart components

## Usage

### Using the UI Context

```tsx
import { useUI } from "@/contexts/UIContext";

function MyComponent() {
  const { collapsed, mobileOpen, toggleCollapsed, isMobile } = useUI();

  return (
    <div>
      <p>Sidebar collapsed: {collapsed ? "Yes" : "No"}</p>
      <p>Mobile drawer open: {mobileOpen ? "Yes" : "No"}</p>
      <p>Is mobile: {isMobile ? "Yes" : "No"}</p>
    </div>
  );
}
```

### Using Chart Resize

```tsx
import { useChartResize } from "@/hooks/useChartResize";

function MyChartComponent() {
  const chartRef = useChartResize();

  return (
    <div ref={chartRef}>
      <ResponsiveContainer width="100%" height="100%">
        {/* Your chart here */}
      </ResponsiveContainer>
    </div>
  );
}
```

### Responsive CSS Classes

The system uses these Tailwind classes for responsive behavior:

- `lg:` prefix for desktop (1024px+)
- Mobile-first approach for smaller screens
- CSS variables for dynamic sidebar width

## CSS Variables

The system sets these CSS variables:

- `--sidebar-w`: Current sidebar width (80px collapsed, 260px expanded, 0px mobile)

## Events

### Layout Change Event

When the sidebar state changes, the system dispatches:

```javascript
window.dispatchEvent(new Event("kpd3:layout:changed"));
```

This event is used by charts to trigger resize operations.

### Signout Event

The existing signout event is preserved:

```javascript
window.dispatchEvent(new CustomEvent("kpd3:signout"));
```

## Accessibility Features

- **Focus Management**: Mobile drawer traps focus
- **Keyboard Navigation**: Escape key closes mobile drawer
- **ARIA Attributes**: Proper labels and expanded states
- **Screen Reader Support**: Semantic HTML and ARIA labels

## Breakpoints

- **Mobile**: < 1024px (lg breakpoint)
- **Desktop**: ≥ 1024px (lg breakpoint)

## LocalStorage

- **Key**: `kpd3.sidebar.collapsed`
- **Values**: `"1"` (collapsed), `"0"` (expanded)
- **Scope**: Desktop only (mobile state is not persisted)

## Route Handling

- **Public Routes**: No sidebar (e.g., `/login`)
- **Protected Routes**: Full layout with sidebar
- **Mobile**: Drawer auto-closes on route changes

## Performance Considerations

- CSS transitions use `transform` and `opacity` for smooth animations
- Layout changes are debounced to prevent excessive re-renders
- Charts resize with a small delay to ensure layout has settled

## Testing

To test the responsive behavior:

1. **Desktop Testing**:

   - Resize browser window to test breakpoint transitions
   - Toggle sidebar collapse/expand
   - Verify content padding adjusts smoothly

2. **Mobile Testing**:

   - Use browser dev tools mobile view
   - Test drawer open/close with hamburger menu
   - Verify backdrop click closes drawer
   - Test route changes close drawer automatically

3. **Accessibility Testing**:
   - Navigate with keyboard only
   - Test screen reader compatibility
   - Verify focus management in mobile drawer

## Migration Notes

- Existing components continue to work without changes
- Chart components can optionally use `useChartResize` for better responsiveness
- No breaking changes to existing APIs or styling
- All existing functionality is preserved
