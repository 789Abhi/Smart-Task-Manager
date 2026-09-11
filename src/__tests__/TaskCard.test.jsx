import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskCard from '../components/TaskCard'
import { STATUSES, PRIORITIES } from '../constants/taskConstants'

const baseTask = {
  id: 'test-1',
  title: 'Implement login',
  description: 'Build the login page',
  status: STATUSES.TODO,
  priority: PRIORITIES.HIGH,
  dueDate: null,
  createdAt: new Date().toISOString(),
}

function renderCard(overrides = {}, handlers = {}) {
  const task = { ...baseTask, ...overrides }
  const onEdit = handlers.onEdit ?? vi.fn()
  const onDelete = handlers.onDelete ?? vi.fn()
  const onMove = handlers.onMove ?? vi.fn()
  render(<TaskCard task={task} onEdit={onEdit} onDelete={onDelete} onMove={onMove} />)
  return { onEdit, onDelete, onMove }
}

describe('TaskCard', () => {
  it('renders the task title', () => {
    renderCard()
    expect(screen.getByTestId('task-title')).toHaveTextContent('Implement login')
  })

  it('renders the correct priority badge', () => {
    renderCard()
    expect(screen.getByTestId('priority-badge')).toHaveTextContent('High')
  })

  it('renders the overdue badge for overdue tasks', () => {
    renderCard({ dueDate: '2000-01-01', status: STATUSES.TODO })
    expect(screen.getByTestId('overdue-badge')).toBeInTheDocument()
  })

  it('does not render overdue badge for done tasks even with past date', () => {
    renderCard({ dueDate: '2000-01-01', status: STATUSES.DONE })
    expect(screen.queryByTestId('overdue-badge')).not.toBeInTheDocument()
  })

  it('does not render overdue badge for future due date', () => {
    renderCard({ dueDate: '2099-12-31', status: STATUSES.TODO })
    expect(screen.queryByTestId('overdue-badge')).not.toBeInTheDocument()
  })

  it('calls onDelete when delete button is clicked', () => {
    const { onDelete } = renderCard()
    fireEvent.click(screen.getByLabelText('Delete task'))
    expect(onDelete).toHaveBeenCalledTimes(1)
  })

  it('calls onEdit when edit button is clicked', () => {
    const { onEdit } = renderCard()
    fireEvent.click(screen.getByLabelText('Edit task'))
    expect(onEdit).toHaveBeenCalledTimes(1)
  })

  it('calls onMove with in-progress when moved from todo via dropdown', () => {
    const { onMove } = renderCard({ status: STATUSES.TODO })
    fireEvent.click(screen.getByLabelText('Move task to another status'))
    fireEvent.click(screen.getByText('In Progress'))
    expect(onMove).toHaveBeenCalledWith(baseTask.id, STATUSES.IN_PROGRESS)
  })

  it('calls onMove with done when moved from in-progress via dropdown', () => {
    const { onMove } = renderCard({ status: STATUSES.IN_PROGRESS })
    fireEvent.click(screen.getByLabelText('Move task to another status'))
    fireEvent.click(screen.getByText('Done'))
    expect(onMove).toHaveBeenCalledWith(baseTask.id, STATUSES.DONE)
  })

  it('can move a done task back to todo via dropdown', () => {
    const { onMove } = renderCard({ status: STATUSES.DONE })
    fireEvent.click(screen.getByLabelText('Move task to another status'))
    fireEvent.click(screen.getByText('Todo'))
    expect(onMove).toHaveBeenCalledWith(baseTask.id, STATUSES.TODO)
  })

  it('move dropdown does not show current status as an option', () => {
    renderCard({ status: STATUSES.IN_PROGRESS })
    fireEvent.click(screen.getByLabelText('Move task to another status'))
    expect(screen.queryAllByText('In Progress')).toHaveLength(0)
  })

  it('renders strikethrough title for done tasks', () => {
    renderCard({ status: STATUSES.DONE })
    expect(screen.getByTestId('task-title')).toHaveClass('line-through')
  })
})
