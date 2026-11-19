# Interface Design Specification

## Product direction

Request Management System is an internal workspace for reviewing, tracking, and updating organizational requests. The interface is Persian-first, right-to-left, and optimized for frequent administrative use.

The visual direction is calm and information-dense without feeling crowded. Navigation stays visually distinct from the working area, while status and priority are communicated through restrained color rather than large decorative elements.

## Layout targets

| Viewport | Layout |
| --- | --- |
| Desktop | 1440 px reference frame, fixed right sidebar, flexible content area |
| Tablet | 768 px reference frame, compact navigation and horizontally scrollable request table |
| Mobile | 360 px reference frame, stacked navigation, compact cards, full-width form controls |

The implementation uses responsive breakpoints at 1120 px, 900 px, and 680 px.

## Foundations

### Color tokens

| Token | Value | Usage |
| --- | --- | --- |
| Primary | `#3157D5` | Main actions, active navigation, links |
| Primary hover | `#2445B8` | Hover state for primary actions |
| Sidebar | `#17263C` | Main navigation surface |
| Page background | `#F5F7FA` | Application canvas |
| Surface | `#FFFFFF` | Cards, forms, panels |
| Text | `#182230` | Primary text |
| Muted text | `#788496` | Supporting text and metadata |
| Border | `#E7EBF1` | Dividers and component outlines |

### Status colors

| Status | Label | Background | Text |
| --- | --- | --- | --- |
| `new` | جدید | `#EDF2FF` | `#4965C8` |
| `in_progress` | در حال بررسی | `#FFF5E7` | `#B77A28` |
| `completed` | تکمیل‌شده | `#EAF7F0` | `#2D946B` |

### Priority colors

| Priority | Label | Background | Text |
| --- | --- | --- | --- |
| `high` | زیاد | `#FFF0EF` | `#D15D5B` |
| `medium` | متوسط | `#FFF6E9` | `#B98237` |
| `low` | کم | `#EEF2F6` | `#758195` |

### Typography

- Primary typeface: Vazirmatn
- Fallbacks: Tahoma, sans-serif
- Page headings: 18–23 px, bold
- Panel headings: 13 px, bold
- Body and controls: 10–12 px
- Metadata: 9–10 px

### Spacing and shape

Use a 4 px base spacing scale: 4, 8, 12, 16, 20, 24, 32, and 40 px.

- Small controls: 8 px radius
- Buttons and filters: 8–9 px radius
- Cards and panels: 12–13 px radius
- Main sidebar brand mark: 11–13 px radius

## Components

Build reusable components with Auto Layout and variants for:

- Primary, secondary, and small buttons; default, hover, focus, and disabled states
- Status badges for new, in-progress, and completed
- Priority badges for high, medium, and low
- Statistic cards with icon, value, label, and supporting caption
- Search input and filter selects
- Request table row and mobile request card
- Form field with default, focus, invalid, and disabled states
- Pagination controls
- Loading, empty, error, success, and conflict messages

Use component properties for text, icon visibility, status, priority, and interaction state. Avoid detached copies of repeated UI.

## Required screens

### Dashboard — desktop and mobile

- Global navigation and page header
- Welcome message and create-request action
- Four statistic cards: total, new, in progress, completed
- Recent requests list
- Empty and loading variants for the recent list

### Request list — desktop, tablet, and mobile

- Search by request title or requester
- Status and priority filters
- Total result count and pagination
- Desktop table with title, requester, creation date, priority, status, and details action
- Mobile cards with the same information and controlled status selection
- Empty, loading, API error, and update-conflict states

### Request details

- Request title, identifier, status, and priority
- Full description
- Requester, creation date, last update, and version
- Edit action and status update control
- Conflict and service-error feedback

### Create and edit request

- Title, description, requester, and priority fields
- Required-field indicators and inline validation
- Save and cancel actions
- Submitting, validation-error, service-error, and version-conflict states

## Prototype flows

1. Dashboard → Request list → Request details
2. Dashboard → Create request → Save → Request details
3. Request list → Search and filter → Request details
4. Request details → Edit → Save changes
5. Request list or details → Change status → Updated state
6. Edit form → Version conflict → Reload latest record

## Accessibility

- Preserve RTL reading and focus order.
- Use text labels in addition to color for status and priority.
- Maintain visible keyboard focus.
- Use clear labels for form controls and icon-only actions.
- Keep text contrast appropriate for small metadata.
- Respect reduced-motion preferences.
- Make mobile controls comfortably tappable.
