# Form Service API

Актуальный контракт реализованного HTTP API.

## Общая информация

Базовый URL:

```text
/api
```

Авторизация отсутствует. Запросы с телом используют JSON.

В клиенте `apiAxios` уже содержит `baseURL: '/api'`, поэтому значения
`API_ROUTES` начинаются с `/forms`, `/pages`, `/fields` и `/public`.

## Общие типы

```ts
type FormStatus = 'draft' | 'published'

type Form = {
	id: number
	title: string
	description: string | null
	slug: string | null
	status: FormStatus
	createdAt: string
	updatedAt: string
}

type FormListItem = Form & {
	submissionCount: number
}

type Page = {
	id: number
	formId: number
	title: string | null
	description: string | null
	position: number
}

type FormPage = Page & {
	fields: FormField[]
}

type FormTree = Form & {
	pages: FormPage[]
}

type Submission = {
	id: number
	formId: number
	createdAt: string
}

type AnswerValue = string | number | string[]
```

Общие свойства поля:

```ts
type FieldBase = {
	id: number
	pageId: number
	position: number
	label: string
	description?: string | null
	required: boolean
}
```

## Формат ошибок

```ts
type ApiErrorResponse = {
	error: {
		code: string
		message: string
		details?: unknown
	}
}
```

Пример:

```json
{
	"error": {
		"code": "FORM_NOT_FOUND",
		"message": "Form not found"
	}
}
```

Основные коды ошибок:

```text
VALIDATION_ERROR
INVALID_JSON
ROUTE_NOT_FOUND
FORM_NOT_FOUND
FORM_HAS_SUBMISSIONS
PAGE_NOT_FOUND
FIELD_NOT_FOUND
FIELD_HAS_ANSWERS
FORM_NOT_READY
INVALID_SUBMISSION
SUBMISSION_NOT_FOUND
INTERNAL_ERROR
```

Все JSON-тела строгие: неизвестные свойства приводят к
`400 VALIDATION_ERROR`.

---

## Проверка сервера

### `GET /api/health`

Ответ `200`:

```json
{
	"status": "ok"
}
```

---

## Формы

### Создание формы

```http
POST /api/forms
```

Тело:

```json
{
	"title": "Анкета участника",
	"description": "Заполните данные для участия"
}
```

Ограничения:

| Поле          | Обязательность | Ограничения                        |
| ------------- | -------------- | ---------------------------------- |
| `title`       | Да             | Строка, 1–200 символов             |
| `description` | Нет            | Строка до 2000 символов или `null` |

Ответ `201` — полное дерево формы с автоматически созданной первой страницей:

```json
{
	"id": 1,
	"title": "Анкета участника",
	"description": "Заполните данные для участия",
	"slug": null,
	"status": "draft",
	"createdAt": "2026-10-22T12:00:00.000Z",
	"updatedAt": "2026-10-22T12:00:00.000Z",
	"pages": [
		{
			"id": 1,
			"formId": 1,
			"title": null,
			"description": null,
			"position": 0,
			"fields": []
		}
	]
}
```

### Список форм

```http
GET /api/forms
```

Необязательный query-параметр `search` фильтрует формы по вхождению строки в
название. Максимальная длина — 200 символов.

```http
GET /api/forms?search=анкета
```

Ответ `200`:

```json
[
	{
		"id": 1,
		"title": "Анкета участника",
		"description": "Заполните данные для участия",
		"slug": null,
		"status": "draft",
		"submissionCount": 0,
		"createdAt": "2026-10-22T12:00:00.000Z",
		"updatedAt": "2026-10-22T12:00:00.000Z"
	}
]
```

Список не содержит `pages` и `fields`. `submissionCount` содержит количество
отправок формы и рассчитывается сервером.

### Получение формы

```http
GET /api/forms/:id
```

Пример:

```http
GET /api/forms/1
```

Ответ `200` — `FormTree` со страницами и полями.

Ошибки:

```text
404 FORM_NOT_FOUND
```

### Изменение формы

```http
PATCH /api/forms/:id
```

Можно передать одно или оба свойства:

```json
{
	"title": "Новое название",
	"description": "Новое описание"
}
```

Удаление описания:

```json
{
	"description": null
}
```

Пустое тело запрещено.

Ответ `200` — обновлённый `FormTree`.

Ошибки:

```text
400 VALIDATION_ERROR
404 FORM_NOT_FOUND
```

### Удаление формы

```http
DELETE /api/forms/:id
```

Тело отсутствует. Ответ `204 No Content`.

Страницы и поля формы без отправок удаляются каскадно. Форму с сохранёнными
отправками удалить нельзя, чтобы не потерять пользовательские ответы.

Ошибки:

```text
404 FORM_NOT_FOUND
409 FORM_HAS_SUBMISSIONS
```

### Публикация формы

```http
POST /api/forms/:id/publish
```

Тело отсутствует.

Ответ `200` — опубликованный `FormTree` со статусом `published` и созданным
`slug`. Повторная публикация сохраняет прежний `slug`.

Ошибки:

```text
404 FORM_NOT_FOUND
409 FORM_NOT_READY
```

Публикация невозможна, если:

- форма не содержит полей;
- `radio`, `checkbox` или `select` не содержит вариантов;
- настройки `checkbox` противоречат количеству вариантов.

Пример ошибки:

```json
{
	"error": {
		"code": "FORM_NOT_READY",
		"message": "Form contains incomplete fields",
		"details": [
			{
				"fieldId": 5,
				"message": "Choice field must contain at least one option"
			}
		]
	}
}
```

### Снятие формы с публикации

```http
POST /api/forms/:id/unpublish
```

Тело отсутствует.

Ответ `200` — полный `FormTree` со статусом `draft`. Существующий `slug`
сохраняется, поэтому повторная публикация возвращает прежнюю публичную ссылку.
Пока форма снята с публикации, запрос `GET /api/public/forms/:slug` возвращает
`404`. Повторное снятие с публикации безопасно и возвращает текущую форму.

Ошибки:

```text
404 FORM_NOT_FOUND
```

---

## Страницы формы

### Создание страницы

```http
POST /api/forms/:id/pages
```

Тело можно оставить пустым или сразу передать метаданные страницы:

```json
{
	"title": "Контактные данные",
	"description": "Укажите удобный способ связи"
}
```

Ограничения:

| Поле          | Обязательность | Ограничения                        |
| ------------- | -------------- | ---------------------------------- |
| `title`       | Нет            | Строка, 1–200 символов или `null`  |
| `description` | Нет            | Строка до 2000 символов или `null` |

`position` назначается сервером после последней страницы формы.

Ответ `201` — созданный `Page` без массива полей.

Ошибки:

```text
400 VALIDATION_ERROR
404 FORM_NOT_FOUND
```

### Изменение страницы

```http
PATCH /api/pages/:id
```

Можно изменить одно или оба свойства:

```json
{
	"title": "Основная информация",
	"description": null
}
```

Пустое тело запрещено. Ответ `200` — обновлённый `Page` без массива полей.

Ошибки:

```text
400 VALIDATION_ERROR
404 PAGE_NOT_FOUND
```

### Удаление страницы

```http
DELETE /api/pages/:id
```

Тело отсутствует. Ответ `204 No Content`. Поля страницы без сохранённых ответов
удаляются каскадно, а позиции следующих страниц нормализуются. Последнюю страницу
формы удалить нельзя.

Ошибки:

```text
404 PAGE_NOT_FOUND
409 FORM_REQUIRES_PAGE
409 PAGE_HAS_ANSWERS
```

---

## Поля формы

### Общие свойства тела

```ts
type FieldDefinition = {
	type:
		'text' | 'textarea' | 'email' | 'number' | 'radio' | 'checkbox' | 'select'
	label: string
	description?: string | null
	required?: boolean
	config?: FieldConfig
}
```

Ограничения:

| Поле          | Обязательность | Ограничения                        |
| ------------- | -------------- | ---------------------------------- |
| `type`        | Да             | Один из семи поддерживаемых типов  |
| `label`       | Да             | Строка, 1–300 символов             |
| `description` | Нет            | Строка до 1000 символов или `null` |
| `required`    | Нет            | Boolean, по умолчанию `false`      |
| `config`      | Нет            | Конфигурация соответствующего типа |

### Добавление поля

Для добавления поля на выбранную страницу используется:

```http
POST /api/pages/:id/fields
```

Здесь `:id` — идентификатор страницы. Поле получает следующую `position`
внутри этой страницы.

Для обратной совместимости сохранён маршрут:

```http
POST /api/forms/:id/fields
```

Он добавляет поле на первую страницу формы.

#### Text

```json
{
	"type": "text",
	"label": "Имя",
	"description": "Введите полное имя",
	"required": true,
	"config": {
		"placeholder": "Введите имя",
		"minLength": 2,
		"maxLength": 100
	}
}
```

#### Textarea

```json
{
	"type": "textarea",
	"label": "Комментарий",
	"description": null,
	"required": false,
	"config": {
		"placeholder": "Ваш комментарий",
		"minLength": 5,
		"maxLength": 1000
	}
}
```

Для `text` и `textarea`:

```ts
type TextConfig = {
	placeholder?: string // до 200 символов
	minLength?: number // целое, >= 0
	maxLength?: number // целое, > 0
}
```

`minLength` не должен превышать `maxLength`.

#### Email

```json
{
	"type": "email",
	"label": "Электронная почта",
	"required": true,
	"config": {
		"placeholder": "mail@example.com",
		"maxLength": 200
	}
}
```

```ts
type EmailConfig = {
	placeholder?: string // до 200 символов
	maxLength?: number // целое, > 0
}
```

#### Number

```json
{
	"type": "number",
	"label": "Возраст",
	"required": true,
	"config": {
		"placeholder": "Введите возраст",
		"min": 16,
		"max": 100,
		"step": 1
	}
}
```

```ts
type NumberConfig = {
	placeholder?: string // до 200 символов
	min?: number
	max?: number
	step?: number // > 0
}
```

`min` не должен превышать `max`.

#### Radio

```json
{
	"type": "radio",
	"label": "Формат участия",
	"required": true,
	"config": {
		"options": [
			{
				"id": "offline",
				"label": "Очно"
			},
			{
				"id": "online",
				"label": "Онлайн"
			}
		]
	}
}
```

#### Select

```json
{
	"type": "select",
	"label": "Город",
	"required": true,
	"config": {
		"options": [
			{
				"id": "moscow",
				"label": "Москва"
			},
			{
				"id": "kazan",
				"label": "Казань"
			}
		]
	}
}
```

Для `radio` и `select`:

```ts
type ChoiceConfig = {
	options: Array<{
		id: string // уникальный, 1–100 символов
		label: string // 1–200 символов
	}>
}
```

#### Checkbox

```json
{
	"type": "checkbox",
	"label": "Интересующие направления",
	"required": true,
	"config": {
		"options": [
			{
				"id": "frontend",
				"label": "Frontend"
			},
			{
				"id": "backend",
				"label": "Backend"
			}
		],
		"minSelected": 1,
		"maxSelected": 2
	}
}
```

```ts
type CheckboxConfig = {
	options: Array<{
		id: string
		label: string
	}>
	minSelected?: number // целое, >= 0
	maxSelected?: number // целое, > 0
}
```

`minSelected` не должен превышать `maxSelected`.

Ответ `201`:

```json
{
	"id": 5,
	"pageId": 1,
	"position": 0,
	"type": "text",
	"label": "Имя",
	"description": "Введите полное имя",
	"required": true,
	"config": {
		"placeholder": "Введите имя",
		"minLength": 2,
		"maxLength": 100
	}
}
```

Ошибки:

```text
400 VALIDATION_ERROR
404 FORM_NOT_FOUND
404 PAGE_NOT_FOUND
```

### Изменение поля

```http
PATCH /api/fields/:id
```

Можно передавать только изменяемые свойства:

```json
{
	"label": "ФИО",
	"required": true,
	"config": {
		"placeholder": "Введите ФИО",
		"minLength": 2,
		"maxLength": 150
	}
}
```

Можно изменить тип, но итоговая комбинация `type` и `config` должна быть
корректной:

```json
{
	"type": "textarea",
	"config": {
		"placeholder": "Расскажите о себе",
		"maxLength": 1000
	}
}
```

Пустое тело запрещено.

Ответ `200` — обновлённое поле.

Ошибки:

```text
400 VALIDATION_ERROR
404 FIELD_NOT_FOUND
409 FIELD_HAS_ANSWERS
```

После появления ответов поле нельзя изменять.

### Удаление поля

```http
DELETE /api/fields/:id
```

Тело отсутствует.

Ответ:

```text
204 No Content
```

Ошибки:

```text
404 FIELD_NOT_FOUND
409 FIELD_HAS_ANSWERS
```

После появления ответов поле нельзя удалить.

---

## Публичная форма

### Получение опубликованной формы

```http
GET /api/public/forms/:slug
```

Пример:

```http
GET /api/public/forms/anketa-uchastnika-a1b2c3d4
```

Ответ `200` — полный `FormTree`.

Черновик по публичному endpoint недоступен.

Ошибки:

```text
404 FORM_NOT_FOUND
```

### Отправка ответов

```http
POST /api/public/forms/:slug/submissions
```

Тело:

```json
{
	"answers": [
		{
			"fieldId": 1,
			"value": "Анна Смирнова"
		},
		{
			"fieldId": 2,
			"value": "anna@example.com"
		},
		{
			"fieldId": 3,
			"value": 21
		},
		{
			"fieldId": 4,
			"value": "online"
		},
		{
			"fieldId": 5,
			"value": ["frontend", "backend"]
		}
	]
}
```

Тип значения:

```ts
type AnswerValueByField = {
	text: string
	textarea: string
	email: string
	number: number
	radio: string
	select: string
	checkbox: string[]
}
```

Для `radio`, `select` и `checkbox` отправляются `option.id`, а не отображаемые
названия.

Ответ `201`:

```json
{
	"id": 10,
	"formId": 1,
	"createdAt": "2026-10-22T13:00:00.000Z",
	"answers": [
		{
			"id": 20,
			"submissionId": 10,
			"fieldId": 1,
			"value": "Анна Смирнова"
		}
	]
}
```

Ошибки:

```text
400 VALIDATION_ERROR
400 INVALID_SUBMISSION
404 FORM_NOT_FOUND
```

`INVALID_SUBMISSION` возвращается, если:

- пропущено обязательное поле;
- значение имеет неправильный тип;
- нарушено ограничение длины, диапазона или шага числа;
- передан неизвестный вариант выбора;
- поле не принадлежит форме;
- один `fieldId` передан несколько раз.

Пример:

```json
{
	"error": {
		"code": "INVALID_SUBMISSION",
		"message": "Submission contains invalid answers",
		"details": [
			{
				"fieldId": 2,
				"message": "Field is required"
			}
		]
	}
}
```

---

## Отправки формы

### Список отправок

```http
GET /api/forms/:id/submissions
```

Ответ `200`:

```json
[
	{
		"id": 10,
		"formId": 1,
		"createdAt": "2026-10-22T13:00:00.000Z",
		"answers": [
			{
				"id": 20,
				"submissionId": 10,
				"fieldId": 1,
				"fieldLabel": "Имя",
				"fieldType": "text",
				"value": "Анна Смирнова"
			}
		]
	}
]
```

Если отправок нет:

```json
[]
```

Список содержит ответы каждой отправки. Серверная пагинация и общее количество
пока не предусмотрены.

Ошибки:

```text
404 FORM_NOT_FOUND
```

### Конкретная отправка

```http
GET /api/forms/:id/submissions/:submissionId
```

Ответ `200`:

```json
{
	"id": 10,
	"formId": 1,
	"createdAt": "2026-10-22T13:00:00.000Z",
	"answers": [
		{
			"id": 20,
			"submissionId": 10,
			"fieldId": 1,
			"fieldLabel": "Имя",
			"fieldType": "text",
			"value": "Анна Смирнова"
		},
		{
			"id": 21,
			"submissionId": 10,
			"fieldId": 4,
			"fieldLabel": "Формат участия",
			"fieldType": "radio",
			"value": "online"
		}
	]
}
```

Ошибки:

```text
404 FORM_NOT_FOUND
404 SUBMISSION_NOT_FOUND
```

---

## Пока не реализовано

```text
изменение порядка страниц
изменение порядка полей
поиск и пагинация отправок
экспорт ответов
```
