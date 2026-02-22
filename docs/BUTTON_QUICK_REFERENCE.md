# Mobile-Friendly Button Quick Reference

## ✅ Common Patterns

### Modal/Dialog Buttons

```vue
<div class="flex flex-col sm:flex-row gap-3 justify-end">
  <ButtonsPresetButton preset="cancel" />
  <ButtonsPresetButton preset="save" />
</div>
```

### Card Action Buttons

```vue
<div class="flex flex-col sm:flex-row gap-2">
  <NuxtLink class="flex-1 ...">View</NuxtLink>
  <button class="flex-1 ...">Edit</button>
</div>
```

### Primary Action First (Mobile)

```vue
<div class="flex flex-col-reverse sm:flex-row gap-3 justify-end">
  <button>Secondary</button>
  <ButtonsPresetButton preset="primary" />
</div>
```

### Full Width Single Button

```vue
<ButtonsPresetButton preset="primary" label="Submit" :fullWidth="true" />
```

## 📱 Responsive Classes Reference

| Class              | Behavior                       |
| ------------------ | ------------------------------ |
| `flex-col`         | Stack vertically (mobile)      |
| `sm:flex-row`      | Row layout on tablet+          |
| `flex-col-reverse` | Primary button first on mobile |
| `gap-2`            | 8px spacing                    |
| `gap-3`            | 12px spacing                   |
| `justify-end`      | Align right on desktop         |

## 🎯 Touch Target Sizes

| Size | Height | Best For             |
| ---- | ------ | -------------------- |
| sm   | 36px   | Secondary actions    |
| md   | 44px   | Default (accessible) |
| lg   | 48px   | Primary CTAs         |
| xl   | 56px   | Hero sections        |

## ⚡ Quick Wins

1. **Replace**: `flex gap-3`
   **With**: `flex flex-col sm:flex-row gap-3`

2. **Replace**: `flex justify-end gap-3`
   **With**: `flex flex-col sm:flex-row gap-3 justify-end`

3. **For important actions**: Use `flex-col-reverse`

## 🧪 Testing

Test on these widths:

- 375px (iPhone SE)
- 390px (iPhone 12/13)
- 768px (iPad)
