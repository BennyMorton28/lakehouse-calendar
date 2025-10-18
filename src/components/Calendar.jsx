import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isWeekend,
  isBefore,
  startOfDay
} from 'date-fns'
import { FAMILY_MEMBERS } from '../App'

const Calendar = ({ currentMonth, onMonthChange, onWeekendClick, weekendInterests }) => {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const handlePrevMonth = () => {
    onMonthChange(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    onMonthChange(addMonths(currentMonth, 1))
  }

  const getWeekendInterestsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return weekendInterests.filter(interest => interest.weekend_date === dateStr)
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6 bg-white rounded-lg shadow-sm p-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          aria-label="Previous month"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
          aria-label="Next month"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    )
  }

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center font-semibold text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day
        const isCurrentMonth = isSameMonth(day, monthStart)
        const isWeekendDay = isWeekend(day)
        const interests = getWeekendInterestsForDate(day)
        const isToday = isSameDay(day, new Date())

        // Count tentative and confirmed
        const tentativeCount = interests.filter(i => i.status === 'tentative').length
        const confirmedCount = interests.filter(i => i.status === 'confirmed').length
        const totalInterest = tentativeCount + confirmedCount

        days.push(
          <div
            key={day}
            className={`
              min-h-[70px] md:min-h-[90px] p-2 border border-gray-200 rounded-lg
              transition-all touch-manipulation
              ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
              ${isWeekendDay && isCurrentMonth ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : 'cursor-default'}
              ${isToday ? 'ring-2 ring-blue-400' : ''}
            `}
            onClick={() => {
              if (isWeekendDay && isCurrentMonth) {
                onWeekendClick(cloneDay)
              }
            }}
          >
            <div className="flex flex-col h-full">
              <span className={`
                text-sm md:text-base font-medium mb-1
                ${!isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}
              `}>
                {format(day, 'd')}
              </span>

              {isWeekendDay && isCurrentMonth && totalInterest > 0 && (
                <div className="flex-1 flex flex-col gap-1">
                  {/* Interest indicators */}
                  <div className="flex flex-wrap gap-1">
                    {interests.slice(0, 3).map((interest, idx) => {
                      const member = FAMILY_MEMBERS.find(m => m.name === interest.person_name)
                      return (
                        <div
                          key={idx}
                          className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                          style={{ backgroundColor: member?.color || '#gray' }}
                          title={`${interest.person_name} - ${interest.status}`}
                        >
                          {interest.person_name[0]}
                        </div>
                      )
                    })}
                    {interests.length > 3 && (
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                        +{interests.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Status counts */}
                  <div className="text-xs text-gray-600 mt-auto">
                    {confirmedCount > 0 && (
                      <div className="font-semibold text-green-600">
                        ✓ {confirmedCount}
                      </div>
                    )}
                    {tentativeCount > 0 && (
                      <div className="text-amber-600">
                        ? {tentativeCount}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

        day = addDays(day, 1)
      }

      rows.push(
        <div key={day} className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
          {days}
        </div>
      )
      days = []
    }

    return <div>{rows}</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 mb-2 font-semibold">Legend:</div>
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-bold">✓</span>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-amber-600 font-bold">?</span>
            <span>Tentative</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
