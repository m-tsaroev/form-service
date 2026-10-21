# Dropdown

`Dropdown` — контекстное меню на базе `radix-ui`. Компонент получает цвета из
глобальных CSS-переменных и работает в светлой и тёмной темах проекта.

## Базовое меню

```tsx
import {
	Dropdown,
	DropdownContent,
	DropdownItem,
	DropdownSeparator,
	DropdownTrigger
} from '@shared/ui'

;<Dropdown>
	<DropdownTrigger>Действия</DropdownTrigger>
	<DropdownContent align='end'>
		<DropdownItem onSelect={() => editItem()}>Редактировать</DropdownItem>
		<DropdownItem onSelect={() => duplicateItem()}>Дублировать</DropdownItem>
		<DropdownSeparator />
		<DropdownItem onSelect={() => deleteItem()}>Удалить</DropdownItem>
	</DropdownContent>
</Dropdown>
```

## Controlled-состояние и отключённый пункт

```tsx
<Dropdown open={open} onOpenChange={setOpen}>
	<DropdownTrigger disabled={isLoading}>Открыть</DropdownTrigger>
	<DropdownContent>
		<DropdownItem disabled={!canShare} onSelect={share}>
			Поделиться
		</DropdownItem>
	</DropdownContent>
</Dropdown>
```

`onSelect` предпочтительнее `onClick`: Radix корректно закрывает меню, возвращает фокус триггеру и поддерживает клавиатуру. Не помещайте в `DropdownItem` ссылки или интерактивные контролы без необходимости — для этого лучше использовать отдельный `DropdownItem asChild`.

## Группы, checkbox и submenu

Используйте `DropdownLabel` для заголовка группы, `DropdownCheckboxItem` для независимых флагов, `DropdownRadioGroup`/`DropdownRadioItem` для выбора одного значения и `DropdownSub`/`DropdownSubTrigger`/`DropdownSubContent` для вложенного меню. Все эти элементы экспортируются из `@shared/ui`.

`DropdownTrigger` поддерживает `showIcon={false}`. Для собственного триггера используйте `asChild` и передайте один элемент:

```tsx
<DropdownTrigger asChild>
	<button className='myButton'>Профиль</button>
</DropdownTrigger>
```

Не задавайте меню фиксированное позиционирование: `DropdownContent` портализуется в `body`, а Radix сам учитывает границы viewport. Для широких меню используйте `className` и переопределяйте только локальные размеры.
